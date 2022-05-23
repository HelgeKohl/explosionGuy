import Player from './player';
import Bomb from './bomb';

export class Playground {
  constructor(maxX, maxY, playerList, obstacleCount) {    
    this.MaxX = maxX;
    this.MaxY = maxY;
    this.ObstaclePositions = [];

    for(let i = 0; i < playerList.length; i++) {
      this.Players[i] = new Player(playerList[i].Playername);
    }
    
    for(let i = 0; i < obstacleCount; i++) {
      this.ObstaclePositions[i] = [Math.floor(Math.random() * maxX), Math.floor(Math.random() * maxY)];
    }
  }

  movePlayer(player, direction) {
    let newPosX = player.PosX;
    let newPosY = player.PosY;
    switch(direction) {
      case 'up':
        newPosY--;
        break;
      case 'down':
        newPosY++;
        break;
      case 'left':
        newPosX--;
        break;
      case 'right':
        newPosX++;
        break;
    }
    if(this.isValidPosition(newPosX, newPosY)) {
      player.setNewPosition(newPosX, newPosY);
    }
  }

  isValidPosition(x, y) {
    if(x < 0 || x >= this.MaxX || y < 0 || y >= this.MaxY) {
      return false;
    }
    for(let i = 0; i < this.ObstaclePositions.length; i++) {
      if(this.ObstaclePositions[i][0] == x && this.ObstaclePositions[i][1] == y) {
        return false;
      }
    }
    return true;
  }
}