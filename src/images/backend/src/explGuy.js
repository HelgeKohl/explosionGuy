// import Game from './classes/game';
const Game = require('./classes/game');

var io;
var gameSocket;
var game;

const TICK_RATE = 20;
const TICKLENGTHMS = 1000 / TICK_RATE;

/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 */

exports.initGame = function(sio, socket){
    console.log("initGame");
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', { message: "You are connected!" });
    console.log("connected");

    gameSocket.on('startGame', () => {
        console.log("startGame");
        game = new Game(10, 10, [{name: "player1", id: 1}, {name: "player2", id: 2}], 1);

        setInterval(function(){
            //select a move every 3 seconds
            game.update()
        }, TICKLENGTHMS);
    })

    // Host Events
    gameSocket.on('hostCreateNewGame', hostCreateNewGame);


    // Player Events
    gameSocket.on('playerJoinGame', playerJoinGame);
    // gameSocket.on('playerAnswer', playerAnswer);
}




/* *******************************
   *                             *
   *       HOST FUNCTIONS        *
   *                             *
   ******************************* */

/**
 * The 'START' button was clicked and 'hostCreateNewGame' event occurred.
 */
 function hostCreateNewGame() {
    // Create a unique Socket.IO Room
    var thisGameId = ( Math.random() * 100000 ) | 0;	// Id als eindeutige Bezeichnung für den "Room" -> kann auch anders erzeugt werden

    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('newGameCreated', {gameId: thisGameId, mySocketId: this.id});

    // Join the Room and wait for the players
    this.join(thisGameId.toString()); 
};






/* *****************************
   *                           *
   *     PLAYER FUNCTIONS      *
   *                           *
   ***************************** */

/**
 * A player clicked the 'START GAME' button.
 * Attempt to connect them to the room that matches
 * the gameId entered by the player.
 * @param data Contains data entered via player's input - playerName and gameId.
 */
 function playerJoinGame(data) {
    //console.log('Player ' + data.playerName + 'attempting to join game: ' + data.gameId );

    // A reference to the player's Socket.IO socket object
    var sock = this;

    // Look up the room ID in the Socket.IO manager object.
    var room = gameSocket.manager.rooms["/" + data.gameId];

    // If the room exists...
    if( room != undefined ){
        // attach the socket id to the data object.
        data.mySocketId = sock.id;

        // Join the room
        sock.join(data.gameId);

        // Emit an event notifying the clients that the player has joined the room.
        io.sockets.in(data.gameId).emit('playerJoinedRoom', data);

    } else {
        // Otherwise, send an error message back to the player.
        this.emit('error',{message: "This room does not exist."} );
    }
}