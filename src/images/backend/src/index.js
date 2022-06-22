const express = require('express');
const { createServer } = require("http");
const { Server } = require('socket.io');
const explGuy = require('./explGuy');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, { 
  cors: {
    origin: 'http://localhost:5000',
    credentials: true
  },
});

const { v4: uuidv4, validate } = require('uuid');

// [{"room": , "owner":}, ..]
//const gameOwnerList = []; 

 // "gamename"=>[ {playerId: playerId1, playername: "name", socket:".."},  ...], 
const playersList = new Map();

// Liste mit aktiven Spielen (diesen Spielen kann nicht beigetreten werden)
var runningGamesList = [];

// ===
// Listen for Socket.IO Connections. Once connected, start the game logic.
io.on('connection', function (socket) {   // io.on geht genauso
  console.log("connected");
  
  // erstelle Spiel 
  socket.on('createGame', function(args, callback) {
    const newRoom = args.room;
    const playername = args.playername;
  
    // validate Name of newRoom
    var val = validateRoomName(newRoom);
    val.playerId = undefined;

    if (val.errorCode == 0){
      console.log("Neuer Raum: " + newRoom);
      val.playerId = uuidv4();

      var data ={ playerId: val.playerId, 
                  playername: playername, 
                  socket: undefined
                };

      playersList.set(newRoom,[data]); 
      console.log(playersList);
    }

    callback(val)
  });

  // trete Spiel bei
  socket.on('joinGame', function(args, callback) {
    const roomToJoin = args.room;
    const playername = args.playername;


    var val = validateJoinGame(roomToJoin);
    val.playerId = undefined;


    if (val.errorCode == 0){
      console.log("Join game: " + roomToJoin);

      val.playerId = uuidv4();
      console.log(val);
  
      var data ={ playerId: val.playerId, 
                  playername: playername, 
                  socket: undefined
                };
      playersList.get(roomToJoin).push(data); 
      console.log(playersList);
    }



    callback(val);
  });


  // sende Games/Rooms zurück
  socket.on('getGames', function(callback) {
    let rooms = getActiveRooms(io);

    // entferne Spiele/rooms, die schon gestartet sind
    rooms.forEach((item, index, object) => {
      if(runningGamesList.includes(item)){
        object.splice(index,1);
      }
    });

    // aktualisiere runningGamesList
    refreshRunningGamesList(io);

    callback(rooms);
  });


  // === auf Lobby/Game -Seite === 
  socket.on('joinRoom', function(args, callback) {
    const playerData = args;

    var response = {  errorCode: undefined, 
                      status: undefined
                  };
    
    // hole Liste mit SpielerDaten
    if (playersList.has(playerData.room)){

      var listPlayerData = playersList.get(playerData.room); 
      for (var i = 0; i < listPlayerData.length; i++){
        if (listPlayerData[i].playerId == playerData.playerId){
  
          // Spieler wurde gefunden -> füge Socket-ID hinzu + join room
          listPlayerData[i].socket = socket;
          socket.join(playerData.room);
          console.log(listPlayerData);
  
          response.errorCode = 0;
          response.status = "success";
        }
        else {
          response.errorCode = -1;
          response.status = "PlayerID nicht gefunden!";
        };
      }

      var playerList = getPlayerNamesFromRoom(io, playerData.room);
      console.log(playerList);
      console.log(getActiveRooms(io));

      // sende bei "Join" Namen aller Spieler (im Room) zurück
      io.to(playerData.room).emit("updatePlayerList", playerList);

    }
    else{
      response.errorCode = -2;
      response.status = "Fehler mit Spiel " + playerData.room + "!";
    }

    callback(response);

  });


  socket.on('startGame', function(room, callback){

    let val = validateStartGame(io, room);

    if (val.errorCode == 0){
      runningGamesList.push(room); 
      explGuy.initGame(io, playersList.get(room), room); 
    }

    callback(val);

  });
  // ===

});



// async function updateOwnerList(){
//   const clients = (await io.fetchSockets()).map(socket => socket.id); 

//   // Lösche Objekte mit abgelaufener Socket-ID
//   gameOwnerList.forEach((item, index, object)=>{
//     if (!clients.includes(item.owner)){
//       object.splice(index,1);
//     }
//   });

//   console.log(gameOwnerList);
// }

function validateRoomName(roomname){
  let response = {
    errorCode: undefined,
    status: undefined
  }

  if (getActiveRooms(io).includes(roomname)){
    response.errorCode = -1;
    response.status = "Spielname schon vorhanden. Wähle einen anderen Namen!";
  }
  else{
    response.errorCode = 0;
    response.status = "success";
  }

  return response;
}

function validateStartGame(io, game){
  let response = {
    errorCode: undefined,
    status: undefined
  }

  if (!io.sockets.adapter.rooms.has(game)){
    response.errorCode = -1;
    response.status = "Spiel nicht mehr gültig!";
    return response;
  }
  
  let num_players = Array.from(io.sockets.adapter.rooms.get(game)).length;

  if (num_players < 2){
    response.errorCode = -2;
    response.status = "Mindestens 2 Spieler notwendig!";
  }
  else{
    response.errorCode = 0;
    response.status = "success";
  }

  return response;


}


function validateJoinGame(game){
  let response = {
    errorCode: undefined,
    status: undefined
  }

  if (runningGamesList.includes(game)){
    response.errorCode = -1,
    response.status = "Spiel schon gestartet! Beitritt nicht mehr möglich!"
  }
  else {
    response.errorCode = 0;
    response.status = "success";
  }

  return response

}


// === Funktion, um Liste mit Namen der aktuellen Rooms zu bekommen ===
// https://simplernerd.com/js-socketio-active-rooms/
function getActiveRooms(io) {
  // Convert map into 2D list:
  // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
  const arr = Array.from(io.sockets.adapter.rooms);
  // Filter rooms whose name exist in set:
  // ==> [['room1', Set(2)], ['room2', Set(2)]]
  const filtered = arr.filter(room => !room[1].has(room[0]))
  // Return only the room name: 
  // ==> ['room1', 'room2']
  const res = filtered.map(i => i[0]);
  return res;
}


function getPlayerNamesFromRoom(io, roomName){
  // get active socket-ids
  const clients = Array.from(io.sockets.adapter.rooms.get(roomName));
  // get player-Data
  var listPlayerData = playersList.get(roomName); 

  var activePlayerList =[];
  // compare active socket-Ids with listPlayerData-socket-Ids -> return names of all active players
  for (var i = 0; i < listPlayerData.length; i++){
    if(clients.includes(listPlayerData[i].socket.id)){
      activePlayerList.push(listPlayerData[i].playername);
    }
  }

  return activePlayerList;

}

// RunningGamesList kann nur Spiele enthalten, deren rooms auch existent/aktiv sind
function refreshRunningGamesList(io){
  runningGamesList = runningGamesList.filter( function(el){
    return getActiveRooms(io).includes(el);
  });
}


httpServer.listen(5000);
console.log("Backend listening on port 5000");
