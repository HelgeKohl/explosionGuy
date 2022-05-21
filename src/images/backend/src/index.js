const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

const path = require('path');

//const http = require('http');     // http-Module - notwendig?
const io = require('socket.io');

var explGuy = require('./explGuy'); // Import the "Backend game logic file".

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
})


/*

//const server = http.createServer(app).listen(port);;  // Create new http-Server - notwendig?
io.listen(app);  // attach the  Socket.IO server to the (http) server

// Listen for Socket.IO Connections. Once connected, start the game logic.
io.sockets.on('connection', function (socket) {   // io.on geht genauso

  explGuy.initGame(io, socket);   //console.log('client connected');
});


*/