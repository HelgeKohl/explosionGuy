const Game = require('./classes/game/game');
const { v4: uuidv4 } = require('uuid');
const EventEmitter  = require('events');

var io;
var gameSocket;
var game;

const TICK_RATE = 5;
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
    var explosionListener = new EventEmitter();

    gameSocket.emit('connected', { playerId:  playerId});
    console.log("connected");

    game = new Game(17, 13, [{Name: "player1", Id: playerId}], 20, explosionListener);

    gameData = game.getPreloadData();
    console.log("Preload Data")

    gameSocket.emit('newGameCreated', gameData);

    gameSocket.on('input', function(args){
        console.log("input", args);

        let returnData = game.onInput(playerId, args.action);
        if(returnData != undefined){
            gameSocket.emit('update', {"input": args.action, "data": returnData});
        }
    });

    explosionListener.on('Explode', bomb => {
        explosionData = game.Playground.explodeBomb(bomb);
        gameSocket.emit('explode', {"input": "explosion", "data": explosionData});
    });
}