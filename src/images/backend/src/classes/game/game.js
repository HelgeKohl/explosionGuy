const Playground = require('./playground');

const Game = class {

  constructor(fieldsizeX, fieldsizeY, playerList, obstacleCount) {    
    console.log("Init Game");
    console.log(playerList);
    this.Playground = new Playground(fieldsizeX, fieldsizeY, playerList, obstacleCount);
  }

  update() {
    this.Playground.update();
  }

  onInput(playerId, input){
    this.Playground.onInput(playerId, input);
  }
}

module.exports = Game;