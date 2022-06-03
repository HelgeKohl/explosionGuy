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

// Listen for Socket.IO Connections. Once connected, start the game logic.
io.on('connection', function (socket) {   // io.on geht genauso
  console.log("connected");

  // wird später verlegt
  explGuy.initGame(io, socket);   //console.log('client connected');

  socket.on('createGame', function() {

  });

  socket.on('joinGame', function() {

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