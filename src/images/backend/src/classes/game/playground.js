const Player = require('./player');
const Bomb = require('./bomb');


const Playground = class {
  constructor(maxX, maxY, playerList, obstacleCount, explosionListener) {  
    console.log("Init Playground");
    console.log(playerList);  
    this.MaxX = maxX;
    this.MaxY = maxY;
    this.ObstaclePositions = [];
    this.WallPosition = [];
    this.Players = [];
    this.Bombs = [];
    this.explosionListener = explosionListener
    
    let playerPosList = [
      [1, 1],
      [maxX-2, maxY-2],
      [maxX-2, 1],
      [1, maxY-2],
    ]
    
    console.log("playerposlist", playerPosList)
    
    for(let i = 0; i < playerList.length; i++) {
      console.log(playerList[i]);
      this.Players[i] = new Player(playerList[i].Name, playerList[i].Id, playerPosList[i][0], playerPosList[i][1]);
    }

    for (let i = 2; i < this.MaxX - 1; i=i+2) {
      for (let j = 2; j < this.MaxY - 1; j=j+2) {
        this.WallPosition.push([i, j]);
      }
    }

    console.log("wallpos", this.WallPosition);

    for(let i = 0; i < obstacleCount; i++) {
      let obstaclePosX = this.getRandomInt(1, maxX-1);
      let obstaclePosY = this.getRandomInt(1, maxY-1);
      let obstaclePos = [obstaclePosX, obstaclePosY];
      
      if(!this.isItemInArray(this.WallPosition, obstaclePos) 
          && !this.isItemInArray(this.ObstaclePositions, obstaclePos) 
          && !this.isItemInArray(playerPosList, obstaclePos)) {
        this.ObstaclePositions.push([obstaclePosX, obstaclePosY]);
      }
      else {
        i--;
      }
    }
    console.log(`Hindernis Positionen: ${this.ObstaclePositions}`);
    console.log(`Wand Positionen: ${this.WallPosition}`);
  }

  onInput(playerId, input){
    let player = this.Players.find(p => p.Id == playerId);

    if(player.IsAlive == false){
      return;
    }

    switch(input) {
      case 'up':
        return this.movePlayer(player, 'up');
      case 'down':
        return this.movePlayer(player, 'down');
      case 'left':
        return this.movePlayer(player, 'left');
      case 'right':
        return this.movePlayer(player, 'right');
      case 'bomb':
        return this.placeBomb(player);
    }

    // return input update here
    // if input is move return new player position
    // if input is bomb return bomb position + timer
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
      
      return this.getPlayerPositions();
    }
    else{
      console.log("Invalid position");
    }
  }

  placeBomb(player) {
    console.log("Player " + player.Name + " placed a bomb at " + player.PosX + " " + player.PosY);
    console.log("new Player BombCount: " + player.BombCount);
    if(player.BombCount > 0) {
      player.BombCount--;
      
      let bomb = new Bomb(player.PosX, player.PosY, player.BombStrength, 3, this.explosionListener);
      this.Bombs.push(bomb);

      return {
        "PlayerId": player.Id,
        "BombCount": player.BombCount, 
        "PosX": player.PosX, 
        "PosY": player.PosY, 
        "BombStrength": player.BombStrength
      };
    }
    else {
      console.log("cant Place new Bomb")
    }

  }

  explodeBomb(bomb) {
    var returnValue = {
      "bomb": bomb,
      "hitPlayers": [],
      "destroyedObstacles": [],
    };

    let explosionRange = bomb.Strength;
    let explosionPositions = [[bomb.PosX, bomb.PosY]];

    let stopTop = false;
    let stopBottom = false;
    let stopLeft = false;
    let stopRight = false;

    // calculate explosion positions and check if they hit a obstacle or wall
    for(let i = 1; i <= explosionRange; i++) {
      // top
      if(!stopTop) {
        let topDirectionPos = [bomb.PosX, bomb.PosY - i];
        // check if position is wall
        if(this.isItemInArray(this.WallPosition, topDirectionPos) || topDirectionPos[1] < 1) {
          stopTop = true;
        }
        // check if position is obstacle
        else if(this.isItemInArray(this.ObstaclePositions, topDirectionPos)) {
          stopTop = true;
          explosionPositions.push(topDirectionPos);

          // add obstacle to destroyedObstacles
          returnValue.destroyedObstacles.push(topDirectionPos);
          // remove obstacle from obstacle list
          this.ObstaclePositions = this.ObstaclePositions.filter(pos => !this.isItemInArray(pos, topDirectionPos));
        }
        // just append position to explosionPositions
        else{
          explosionPositions.push(topDirectionPos);
        }
      }
      // bottom
      if(!stopBottom) {
        let bottomDirectionPos = [bomb.PosX, bomb.PosY + i];
        // check if position is wall
        if(this.isItemInArray(this.WallPosition, bottomDirectionPos) || bottomDirectionPos[1] > this.MaxY - 1) {
          stopBottom = true;
        }
        // check if position is obstacle
        else if(this.isItemInArray(this.ObstaclePositions, bottomDirectionPos)) {
          stopBottom = true;
          explosionPositions.push(bottomDirectionPos);
          // add obstacle to destroyedObstacles
          returnValue.destroyedObstacles.push(bottomDirectionPos);
          // remove obstacle from obstacle list
          this.ObstaclePositions = this.ObstaclePositions.filter(pos => !this.isItemInArray(pos, bottomDirectionPos));
        }
        // just append position to explosionPositions
        else{
          explosionPositions.push(bottomDirectionPos);
        }
      }
      // left
      if(!stopLeft) {
        let leftDirectionPos = [bomb.PosX - i, bomb.PosY];
        // check if position is wall
        if(this.isItemInArray(this.WallPosition, leftDirectionPos) || leftDirectionPos[0] < 1) {
          stopLeft = true;
        }
        // check if position is obstacle
        else if(this.isItemInArray(this.ObstaclePositions, [bomb.PosX, bomb.PosY + i])) {
          stopLeft = true;
          explosionPositions.push(leftDirectionPos);
          // add obstacle to destroyedObstacles
          returnValue.destroyedObstacles.push(leftDirectionPos);
          // remove obstacle from obstacle list
          this.ObstaclePositions = this.ObstaclePositions.filter(pos => !this.isItemInArray(pos, leftDirectionPos));
        }
        // just append position to explosionPositions
        else{
          explosionPositions.push(leftDirectionPos);
        }
      }
      // right
      if(!stopRight) {
        let rightDirectionPos = [bomb.PosX + i, bomb.PosY];
        // check if position is wall
        if(this.isItemInArray(this.WallPosition, rightDirectionPos) || rightDirectionPos[0] > this.MaxX - 1) {
          stopRight = true;
        }
        // check if position is obstacle
        else if(this.isItemInArray(this.ObstaclePositions, rightDirectionPos)) {
          explosionPositions.push(rightDirectionPos);
          stopRight = true;
          // add obstacle to destroyedObstacles
          returnValue.destroyedObstacles.push(rightDirectionPos);
          // remove obstacle from obstacle list
          this.ObstaclePositions = this.ObstaclePositions.filter(pos => !this.isItemInArray(pos, rightDirectionPos));
        }
        // just append position to explosionPositions
        else{
          explosionPositions.push(rightDirectionPos);
        }
      }

      // if all directions are stopped, stop loop
      if(stopTop && stopBottom && stopLeft && stopRight) {
        break;
      }
    }
    
    // check if explosionPositions hit a player
    for(let i = 0; i < explosionPositions.length; i++) {
      for(let j = 0; j < this.Players.length; j++) {
        if(this.Players[j].PosX == explosionPositions[i][0] && this.Players[j].PosY == explosionPositions[i][1]) {
          this.Players[j].IsAlive = false;
          returnValue.hitPlayers.push(this.Players[j]);
        }
      }
    }

    returnValue["explosionPositions"] = explosionPositions;

    return returnValue;
  }

  getPlayerPositions() {
    let playerPositions = [];
    for(let i = 0; i < this.Players.length; i++) {
      let id = this.Players[i].Id
      playerPositions.push({id: id, data: [this.Players[i].PosX, this.Players[i].PosY]});
    }

    return playerPositions
  }

  isValidPosition(x, y) {
    // check map boundaries
    if(x < 1 || x >= this.MaxX-1 || y < 1 || y >= this.MaxY-1) {
      return false;
    }

    // check wall
    for(let i = 0; i < this.WallPosition.length; i++) {
      if(this.WallPosition[i][0] == x && this.WallPosition[i][1] == y) {
        return false;
      }
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

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  isItemInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] == item[0] && array[i][1] == item[1]) {
            return true;   // Found it
        }
    }
    return false;   // Not found
}
}

module.exports = Playground;