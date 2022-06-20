const Playground = require('./playground');

const Game = class {

  constructor(fieldsizeX, fieldsizeY, playerList, obstacleCount, explosionListener) {    
    console.log("Init Game");
    console.log(playerList);
    this.Playground = new Playground(fieldsizeX, fieldsizeY, playerList, obstacleCount, explosionListener);
  }

  onInput(playerId, input){
    return this.Playground.onInput(playerId, input);
  }

  getPreloadData() {
    let gamedata = {};
    gamedata.mWidth = this.Playground.MaxX;
    gamedata.mHeight = this.Playground.MaxY;

    gamedata.player = {};

    for (let index = 0; index < this.Playground.Players.length; index++) {
      gamedata.player[this.Playground.Players[index].Id] = {
        name: this.Playground.Players[index].Name,
        pos: [this.Playground.Players[index].PosX, this.Playground.Players[index].PosY]
      }
    }

    gamedata.layer1Data = []
    gamedata.layer2Data = []

    for (let index = 0; index <= gamedata.mHeight; index++) {
      gamedata.layer1Data.push(new Array(gamedata.mWidth+1).fill(0))
      gamedata.layer2Data.push(new Array(gamedata.mWidth).fill(-1))
    }

    this.Playground.WallPosition.forEach(pos => {
      gamedata.layer1Data[pos[1]][pos[0]] = 1;
    });

    
    this.Playground.ObstaclePositions.forEach(pos => {
      gamedata.layer2Data[pos[1]][pos[0]] = 2;
    });

    return gamedata;
  }
}

module.exports = Game;