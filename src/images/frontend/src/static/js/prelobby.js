import IO from "./app.js";

const url="/game?";
var gameRoom = "";
var playerId ="";
var playername = "";


// Event-Listener
var inputPlayerName = document.getElementById("playername");
var inputGameName = document.getElementById("gamename");
var inputCreateGame = document.getElementById("createGame");
var inputUpdateRooms = document.getElementById("updateList");
var gamelist = document.getElementById("gamelist");

inputPlayerName.addEventListener("keyup", function(){
	enableCreateGame();
	enableJoinGame();
});

inputGameName.addEventListener("keyup", function(){
	enableCreateGame();
});

inputCreateGame.addEventListener("click", function(){
	createGame();
});

inputUpdateRooms.addEventListener("click", function(){
	updateRoomList();
});

gamelist.addEventListener("click", function(event){
	const isButton = event.target.nodeName === 'BUTTON';
	if (!isButton) {
		console.log("Kein Button!");
		return;
	}
	gameRoom = event.target.innerHTML;
	console.log(gameRoom);
	joinGame();

})

// aktiviere Button "CreateGame"
function enableCreateGame() {
	if((inputGameName.value=="") || (inputPlayerName.value=="")) { 
		inputCreateGame.disabled = true; 
	} else { 
		inputCreateGame.disabled = false;
	}
}

// aktiviere Buttons der Gamelist, um dem Spiel joinen zu können
function enableJoinGame() {
	if(inputPlayerName.value=="") { 
		for(var i = 0; i < gamelist.children.length; i++){
			gamelist.children[i].disabled = true;
		}
	} else { 
		for(var i = 0; i < gamelist.children.length; i++){
			gamelist.children[i].disabled = false;
		}
	}
}


// erstelle Room (mit Button)
function createGame(){
	gameRoom= inputGameName.value;
	playername = inputPlayerName.value;

	console.log("Try to create Room: " + gameRoom);
	console.log("Eigene Socket ID: " + IO.socket.id);


	let data = {	room: gameRoom, 
					playername: playername
				};

	IO.socket.emit("createGame", data, (response)=> { 
		console.log(response.status);

		// kein Error
		if (response.errorCode == 0){ 
			playerId = response.playerId;
			console.log(response.playerId);
			window.location.href = url + "p1=" + gameRoom + "&p2=" + playerId + "&p3=" + playername;
		}
	});
}

// join Game mit Auswahl (select) + Button
function joinGame(){
	console.log("join");
	playername = inputPlayerName.value;

	let data = {	room: gameRoom, 
					playername: playername
				};

	IO.socket.emit("joinGame", data, (response) => { 

		// bei Erfolg - Spiel anzeigen
		if (response.errorCode == 0){ // kein Error
			playerId = response.playerId;
			console.log(response.playerId);
			window.location.href = url + "p1=" + gameRoom + "&p2=" + playerId + "&p3=" + playername;
		}

	});

}

// Aktualisiere Room-Liste mit Ack 
function updateRoomList(){
	console.log("UpdateRoomList");

	IO.socket.emit("getGames", (response) => {
		const data = response;

		// init: lösche alle Items + füge "Überschrift"-Item hinzu
		gamelist.innerHTML = '';
		let listitem = document.createElement("li");
		listitem.className = "list-group-item px-3 border-0";
		listitem.innerHTML = "Spiele:";
		listitem.disabled = true;
		gamelist.appendChild(listitem);

		// 
		data.forEach((item)=>{
		let btn = document.createElement("button");
		btn.className= "list-group-item list-group-item-action btn btn-outline-secondary px-2";
		btn.type="button";
		btn.innerHTML=item;
		console.log(btn.innerHTML);
		gamelist.appendChild(btn);

		// Buttons aktivieren/deaktivieren (muss hier gemacht werden!)
		enableJoinGame(); 
		})

	});

}		
