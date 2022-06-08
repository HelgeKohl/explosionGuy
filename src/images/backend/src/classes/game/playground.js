const Player = require('./player');
const Bomb = require('./bomb');

const Playground = class {
  constructor(maxX, maxY, playerList, obstacleCount) {  
    console.log("Init Playground");
    console.log(playerList);  
    this.MaxX = maxX;
    this.MaxY = maxY;
    this.ObstaclePositions = [];
    this.Players = [];
    this.Bombs = [];
    this.Tick = 0;

    for(let i = 0; i < playerList.length; i++) {
      console.log(playerList[i]);
      this.Players[i] = new Player(playerList[i].Name, playerList[i].Id, playerList[i].PosX, playerList[i].PosY);
    }
    
    for(let i = 0; i < obstacleCount; i++) {
      this.ObstaclePositions[i] = [Math.floor(Math.random() * maxX), Math.floor(Math.random() * maxY)];
    }
    console.log(`Hindernis Positionen: ${this.ObstaclePositions}`);
  }

  update() {
    // update bombs
    console.log(`Tick ist: ${this.Tick}`)
    if(this.Tick % 60 == 0) {
      for(let i = 0; i < this.Bombs.length; i++) {
        this.Bombs[i].Timer--;
        console.log(`Bomb Timer ist: ${this.Bombs[i].Timer}`)
        if(this.Bombs[i].Timer <= 0) {
          this.explodeBomb(this.Bombs[i]);
          this.Bombs.splice(i, 1);
        }
      }
  
      // update players
      for(let i = 0; i < this.Players.length; i++) {
        this.Players[i].refreshBombCount();
      }
    }

    this.Tick++;
  }

  onInput(playerId, input){
    let player = this.Players.find(p => p.Id == playerId);

    if(player.IsAlive == false){
      return;
    }

    try {
      switch(input) {
        case 'up':
          this.movePlayer(player, 'up');
          break;
        case 'down':
          this.movePlayer(player, 'down');
          break;
        case 'left':
          this.movePlayer(player, 'left');
          break;
        case 'right':
          this.movePlayer(player, 'right');
          break;
        case 'bomb':
          this.placeBomb(player);
          break;
      }
    }
    catch(e) {
      console.log(e);
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
      console.log("Player " + player.Name + " moved to " + newPosX + " " + newPosY);
    }
    else{
      console.log("Invalid position");
    }
  }

  placeBomb(player) {
    if(player.BombCount > 0) {
      player.BombCount--;
      let bomb = new Bomb(player.PosX, player.PosY, player.BombStrength, 3);
      this.Bombs.push(bomb);
    }
  }

  explodeBomb(bomb) {
    let explosionRange = bomb.Strength;
    let explosionPositions = [];
    for(let i = 0; i < explosionRange+1; i++) {
      explosionPositions.push([bomb.PosX + i, bomb.PosY]);
      explosionPositions.push([bomb.PosX - i, bomb.PosY]);
      explosionPositions.push([bomb.PosX, bomb.PosY + i]);
      explosionPositions.push([bomb.PosX, bomb.PosY - i]);
    }
    console.log(`Positionen der Explosionen: ${explosionPositions}`);
    
    for(let i = 0; i < explosionPositions.length; i++) {
      for(let j = 0; j < this.Players.length; j++) {
        if(this.Players[j].PosX == explosionPositions[i][0] && this.Players[j].PosY == explosionPositions[i][1]) {
          this.Players[j].IsAlive = false;
        }
      }
    }
  }

  isValidPosition(x, y) {
    // check map boundaries
    if(x < 0 || x >= this.MaxX || y < 0 || y >= this.MaxY) {
      return false;
    }

    // check obstacles
    for(let i = 0; i < this.ObstaclePositions.length; i++) {
      if(this.ObstaclePositions[i][0] == x && this.ObstaclePositions[i][1] == y) {
        return false;
      }
    }

    // check for other players
    for(let i = 0; i < this.Players.length; i++) {
      if(this.Players[i].PosX == x && this.Players[i].PosY == y) {
        return false;
      }
    }

    // check for bombs
    for(let i = 0; i < this.Bombs.length; i++) {
      if(this.Bombs[i].PosX == x && this.Bombs[i].PosY == y) {
        return false;
      }
    }

    return true;
  }
}

module.exports = Playground;