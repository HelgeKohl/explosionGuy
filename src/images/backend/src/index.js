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

  
  socket.on('createGame', function() {

    const rooms = getActiveRooms(io);

    if (rooms.length > 0) {
      socket.join(rooms[0]);    // (zum Testen) 1. Raum beitreten
      console.log("Beitritt zu: " + rooms[0]);
    }
    else {
      socket.join("room1");     // neuen Raum erstellen
      console.log("noch kein Room vorhanden - room1 erstellt.");
    }

    console.log(io.sockets.adapter.rooms);
    //console.log(rooms);

  });

  socket.on('joinGame', function() {

    //const rooms = getActiveRooms(io);

    // mit Button-Klick -> Room-Beitritt

    // if (rooms.length > 0) {
    //   socket.join(rooms[0]);                        // zum Testen 1. Raum beitreten
    //   console.log("Beitritt zu Raum: " + rooms[0]);
    // } else {
    //   console.log("Kein offenes Spiel bzw. Room");
    // }


  });

  socket.on('getGames', function() {

  });
});

httpServer.listen(5000);
console.log("Backend listening on port 5000");





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