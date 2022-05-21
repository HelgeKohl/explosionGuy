;
jQuery(function($){    
    'use strict';

    /**
     * All the code relevant to Socket.IO is collected in the IO namespace.
     */
    var IO = {

		/**
		 * This is called when the page is displayed. It connects the Socket.IO client
		 * to the Socket.IO server
		 */
		init: function() {
		IO.socket = io.connect();
		IO.bindEvents();
		},

        /**
         * While connected, Socket.IO will listen to the following events emitted
         * by the Socket.IO server, then run the appropriate function.
         */
		 bindEvents : function() {
            IO.socket.on('connected', IO.onConnected );
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
		 onConnected : function() {
            // Cache a copy of the client's socket.IO session ID on the App
            App.mySocketId = IO.socket.socket.sessionid;
        },


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

			// To do
			;

        },

	};

    IO.init();
    App.init();

}($));
