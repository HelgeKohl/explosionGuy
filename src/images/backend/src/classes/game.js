import Playground from './playground';

export class Game {
  constructor(fieldsizeX, fieldsizeY, playerList, obstacleCount) {    
    this.Playground = new Playground(fieldsizeX, fieldsizeY, playerList, obstacleCount);
  }

  update() {
    this.Playground.update();
  }
}