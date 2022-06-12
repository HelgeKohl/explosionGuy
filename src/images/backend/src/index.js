const express = require('express');
const { createServer } = require("http");
const { Server } = require('socket.io');
const explGuy = require('./explGuy'); // Import the "Backend game logic file".

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, { 
  cors: {
    origin: 'http://localhost:5000',
    credentials: true
  },
});

// 
const gameOwnerList = []; // [{"room": , "owner":}, ..]
const playersList =[]; //[{"room:" , "players":[player1, player2,..] }, ..]


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
// ===


// Listen for Socket.IO Connections. Once connected, start the game logic.
io.on('connection', function (socket) {   // io.on geht genauso
  console.log("connected");
  


  // wird später verlegt
  explGuy.initGame(io, socket);   //console.log('client connected');

  

  // erstelle Spiel 
  //-> Spielersteller ist "Owner" (nur er kann Spiel starten)
  socket.on('createGame', function(args, callback) {
    updateOwnerList();

    const newRoom = args;
    //const rooms = getActiveRooms(io); // alle Räume bzw. Spiele

    // -> validate Name of newRoom!!!
    // To Do ...
    var val = validateRoomName(newRoom);

    if (val.errorCode != 0){
      callback(val);
    }
    else{

      console.log("Neuer Raum: " + newRoom);
      socket.join(newRoom);
      gameOwnerList.push({"room": newRoom, "owner": socket.id}) // notwendig? - soll jeder Spiel starten können?
      console.log(gameOwnerList);
  
      console.log(io.sockets.adapter.rooms);
  
      callback({
        errorCode: 0,       // <> 0 -> Fehler
        status: "success"
      })

    }

    

  });


  // trete Spiel bei
  socket.on('joinGame', function(args, callback) {
    updateOwnerList();

    const roomToJoin = args;

    // validate!
    // To Do ...

    console.log("Join room: " + roomToJoin);
    socket.join(roomToJoin);
    console.log(io.sockets.adapter.rooms);

    callback({
      errorCode: 0,       // <> 0 -> Fehler
      status: "success"
    })


  });

  // sende Games/Rooms zurück
  socket.on('getGames', function(callback) {
    const rooms = getActiveRooms(io);

    callback(rooms);

  });

});







// Update OwnerList
async function updateOwnerList(){
  const clients = (await io.fetchSockets()).map(socket => socket.id); 

  // Lösche Objekte mit abgelaufener Socket-ID
  gameOwnerList.forEach((item, index, object)=>{
    if (!clients.includes(item.owner)){
      object.splice(index,1);
    }
  });

  console.log(gameOwnerList);

}

// Validate roomname
function validateRoomName(roomname){
  if (getActiveRooms(io).includes(roomname)){
    return {
      errorCode: -1,       // <> 0 -> Fehler
      status: "Spielname schon vorhanden. Wähle einen anderen Namen!"
    };
  }
  //...
  else{
    return {
      errorCode: 0,       // <> 0 -> Fehler
      status: "success"
    };
  }
}




httpServer.listen(5000);
console.log("Backend listening on port 5000");



    // // sende Starterlaubnis an Gameowner (bei mind. 2 Spieler):
    // //const nPlayers = getActiveRooms(io).length;
    // console.log(io.sockets.adapter.rooms.get(roomToJoin).size);

    // if (io.sockets.adapter.rooms.get(roomToJoin).size > 1){

    //   gameOwnerList.forEach((item)=>{
    //     if (item.room == roomToJoin){
    //       console.log("Socket-ID Owner:" + item.owner);
    //       io.to(item.owner).emit("allowStartGame");
    //     }
    //   });      

    // }





/*
API - Client to Server
join(player)
Move(player, richtung)
PlaceBomb(player)

API - Server to Clients
init()
UpdateGameState()
{
  players: [
    {
      Playername = playerName;
      PlayerId = playerId;
      PosX = 3;
      PosY = 4;
      BombCount = 1;
      BombStrength = 1;
      IsAlive = true;
    },
    {
      Playername = playerName;
      PlayerId = playerId;
      PosX = 10;
      PosY = 8;
      BombCount = 1;
      BombStrength = 1;
      IsAlive = false;
    }
  ],
  bombs: [
    {
      PosX = 3;
      PosY = 4;
      Strength = 1;
      Countdown = 3;
    },
    ....
  ]
}
*/