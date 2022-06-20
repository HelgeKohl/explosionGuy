import Load from './game/load.js';
import MainLevel from "./game/main.js";

/**
 * All the code relevant to Socket.IO is collected in the IO namespace.
 */
var IO = {
    /**
     * This is called when the page is displayed. It connects the Socket.IO client
     * to the Socket.IO server
     */
    init: function() {
        console.log("init");
        this.socket = io("http://localhost:5000", {
            withCredentials: true,
            transports: ['websocket'],
        });

        console.log("connect");
        
        IO.bindEvents();

        // document.getElementById("startButton").addEventListener("click", function() {
        //     console.log("startButton");
        //     IO.socket.emit("startGame");
        // });
    },

    /**
     * While connected, Socket.IO will listen to the following events emitted
     * by the Socket.IO server, then run the appropriate function.
     */
    bindEvents : function() {
        console.log("binding events");
        IO.socket.on('connected', IO.onConnected );
        IO.socket.on('disconnected', IO.onDisconnect );
        IO.socket.on('newGameCreated', (args) => {
            IO.onNewGameCreated(args)
        });
        // IO.socket.on('newGameCreated', IO.onNewGameCreated );
        // IO.socket.on('playerJoinedRoom', IO.playerJoinedRoom );
        // IO.socket.on('beginNewGame', IO.beginNewGame );
        //..
        //IO.socket.on('gameOver', IO.gameOver);
        //IO.socket.on('error', IO.error );
    },

    /**
     * The client is successfully connected!
     */
    onConnected : function(args) {
        // Cache a copy of the client's socket.IO session ID on the App
        console.log("connected");
        IO.playerId = args.playerId;
        IO.socket.emit('startGame');
        App.mySocketId = IO.socket.sessionid;
    },

    onDisconnect : function() {
        console.log("disconnected");
    },

    onNewGameCreated : function(args) {
        console.log("New Game started")

        const config = {
            title: 'Explosion Guy',
            type: Phaser.AUTO,
            width: 544, //17 x 32
            height: 416, //13 x 32
            autoCenter: true,
            // Bildschirm ausfüllen
            scale: {
                mode: Phaser.Scale.FIT
            },
            scene: [new Load(args), new MainLevel(IO, args)],
            physics: {
                default:"arcade", arcade:{
                    debug:true
                }
            }
        };

        const game = new Phaser.Game(config);
    }

    //....
};

var App = {
    /**
     * The Socket.IO socket object identifier. This is unique for
     * each player and host. It is generated when the browser initially
     * connects to the server when the page loads for the first time.
     */
    mySocketId: '',		

    /**
     * This runs when the page initially loads.
     */
    init: function () {

    },

};

IO.init();
// App.init();
