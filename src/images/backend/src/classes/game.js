const Playground = require('./playground');

const Game = class {

  constructor(fieldsizeX, fieldsizeY, playerList, obstacleCount) {    
    this.Playground = new Playground(fieldsizeX, fieldsizeY, playerList, obstacleCount);
  }

  update() {
    this.Playground.update();
  }
}

module.exports = Game;