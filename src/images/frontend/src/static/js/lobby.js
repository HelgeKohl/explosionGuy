
import IO from './app.js';

// Parameter
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const gameName = urlParams.get('p1');
const playerId = urlParams.get('p2');
const playername = urlParams.get('p3');

IO.playerId = playerId;

console.log("Game-Name: " + gameName);
console.log("Player-ID: " + playerId);
console.log("Player-Name: "  + playername);


// Event-Listener
var playerList = document.getElementById("playerList");

var startGameButton = document.getElementById("startGame");
startGameButton.addEventListener("click", function(){
	startGame();
});



// "Init": Join Room 
const data = {	room: gameName, 
				playerId: playerId, 
				playername: playername
			};

IO.socket.emit("joinRoom", data, (response) => {

	console.log(response.status);
	console.log(IO.socket.id);


});


// Update, wenn (anderer) Spieler joint
IO.socket.on("updatePlayerList", function(args){
	let players = args;

	console.log(players);
	updatePlayerList(players);

});

// starte Spiel mit Button
function startGame(){
	IO.socket.emit("startGame", data.room, (response) => {
		console.log(response.status);

		// if (response.errorCode != 0){
		// 	window.location.href = "/prelobby";
		// }
	});
};


// aktualisiere Player-List
function updatePlayerList(updatetList){
	console.log("UpdatePlayerList");

	let data = updatetList;
	// init: lösche alle Items + füge "Überschrift"-Item hinzu
	playerList.innerHTML = '';
	let listitem = document.createElement("li");
	listitem.className = "list-group-item px-3 border-0";
	listitem.innerHTML = "Spielerliste:";
	playerList.appendChild(listitem);

	// 
	data.forEach((item)=>{
	let li = document.createElement("li");
	li.className = "list-group-item px-3 border-0";
	li.innerHTML=item;
	console.log(li.innerHTML);
	playerList.appendChild(li);
	})

};		