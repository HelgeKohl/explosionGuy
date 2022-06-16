const Game = require('./classes/game/game');
const { v4: uuidv4 } = require('uuid');

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
    // Initialisiere Game
    console.log("initGame");
    io = sio;
    gameSocket = socket;

    // onJoinRoom
    var playerId = uuidv4();
    gameSocket.emit('connected', { playerId:  playerId});
    console.log("connected");

    gameSocket.on('startGame', function(){
        console.log("start Game");

        game = new Game(10, 10, [{Name: "player1", Id: playerId}], 1);
        gameSocket.emit("newGameCreated", {message: "hello"});
        console.log("Game initialized");
        console.log(game.Playground.Players)
        setInterval(function(){
            //select a move every 3 seconds
            game.update()
            gameSocket.emit('update', {});
        }, TICKLENGTHMS);
    });

    gameSocket.on('input', function(args){
        game.onInput(playerId, args.direction);
    });
}