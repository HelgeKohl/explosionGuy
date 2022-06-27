const Game = require('./classes/game/game');
const { v4: uuidv4 } = require('uuid');
const EventEmitter  = require('events');

var io;
var game;

const TICK_RATE = 5;
const TICKLENGTHMS = 1000 / TICK_RATE;

/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 */

exports.initGame = function(sio, sockets, room){
    // Initialisiere Game
    console.log("initGame");
    io = sio;
    var gameSockets = sockets;
    var playerList = [];

    for (var i = 0; i < gameSockets.length; i++) {
        let player = {
            Name: gameSockets[i].playername,
            Id: gameSockets[i].playerId,
        }

        playerList.push(player);
    }

    console.log("################################################################")
    console.log("################################################################")
    console.log("################################################################")
    var explosionListener = new EventEmitter();

    game = new Game(16, 12, playerList, 20, explosionListener);

    gameData = game.getPreloadData();
    console.log("Preload Data")

    io.to(room).emit('newGameCreated', gameData);

    console.log(gameSockets)
    gameSockets.forEach(function(socket) {
        socket.socket.on('input', function(args){
            console.log("input", args);
    
            let returnData = game.onInput(socket.playerId, args.action);
            if(returnData != undefined){
                io.to(room).emit('update', {"input": args.action, "data": returnData});
            }
        });
    });

    explosionListener.on('Explode', bomb => {
        explosionData = game.Playground.explodeBomb(bomb);

        let alivePlayers = game.Playground.getAlivePlayers();
        let isGameOver = (alivePlayers.length < 2);
        
        explosionData.isGameOver = isGameOver;
        explosionData.alivePlayers = alivePlayers;
        io.to(room).emit('explode', {"input": "explosion", "data": explosionData});

        if (isGameOver){
            // trennt Verbindung zu Sockets in room (und zerstört damit auch room)
            io.in(room).disconnectSockets(true);
            game = undefined;
        }


    });
    
    explosionListener.on('Refresh', player => {
        let refreshData = {
            Id: player.Id,
            BombCount: player.BombCount
        }
        io.to(room).emit('refresh', {"input": "refresh", "data": refreshData});
    })
}