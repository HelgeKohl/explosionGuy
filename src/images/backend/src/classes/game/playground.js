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
    
    for(let i = 0; i < playerList.length; i++) {
      console.log(playerList[i]);
      this.Players[i] = new Player(playerList[i].Name, playerList[i].Id, playerPosList[i][0], playerPosList[i][1]);
    }

    for(let i = 0; i <= this.MaxX; i++) {
      this.WallPosition.push([i, 0]);
      this.WallPosition.push([i, this.MaxY]);
    }
    
    for(let i = 1; i < this.MaxY; i++) {
      this.WallPosition.push([0, i]);
      this.WallPosition.push([this.MaxX, i]);
    }

    for (let i = 2; i < this.MaxX - 1; i=i+2) {
      for (let j = 2; j < this.MaxY - 1; j=j+2) {
        this.WallPosition.push([i, j]);
      }
    }

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
    }
    else{
      console.log("Invalid position");
    }
    return this.getPlayerPositions();
  }

  placeBomb(player) {
    //check if there is already a bomb
    let valid  = true;
    for(let i = 0; i < this.Bombs.length; i++) {
      if(this.Bombs[i].PosX == player.PosX && this.Bombs[i].PosY == player.PosY) {
        valid = false;
      }
    }
    
    if(player.BombCount > 0 && valid) {
      console.log("Player " + player.Name + " placed a bomb at " + player.PosX + " " + player.PosY);
      console.log("new Player BombCount: " + player.BombCount);
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
        // get next position in top direction
        let topDirectionPos = [bomb.PosX, bomb.PosY - i];
        // check if position is wall
        if(this.isItemInArray(this.WallPosition, topDirectionPos) || topDirectionPos[1] < 1) {
          stopTop = true;
        }
        // check if position is obstacle
        else if(this.isItemInArray(this.ObstaclePositions, topDirectionPos)) {
          console.log("top obstacle", topDirectionPos);
          stopTop = true;
          explosionPositions.push(topDirectionPos);

          // add obstacle to destroyedObstacles
          returnValue.destroyedObstacles.push(topDirectionPos);
          // remove obstacle from obstacle list
          this.ObstaclePositions.splice(this.getIndexOfArray(this.ObstaclePositions, topDirectionPos), 1);
        }
        // just append position to explosionPositions
        else{
          explosionPositions.push(topDirectionPos);
        }
      }

      // bottom
      if(!stopBottom) {
        // get next position in bottom direction
        let bottomDirectionPos = [bomb.PosX, bomb.PosY + i];
        // check if position is wall
        if(this.isItemInArray(this.WallPosition, bottomDirectionPos) || bottomDirectionPos[1] > this.MaxY - 2) {
          stopBottom = true;
        }
        // check if position is obstacle
        else if(this.isItemInArray(this.ObstaclePositions, bottomDirectionPos)) {
          console.log("bottom obstacle", bottomDirectionPos);
          stopBottom = true;
          explosionPositions.push(bottomDirectionPos);

          // add obstacle to destroyedObstacles
          returnValue.destroyedObstacles.push(bottomDirectionPos);
          // remove obstacle from obstacle list
          this.ObstaclePositions.splice(this.getIndexOfArray(this.ObstaclePositions, bottomDirectionPos), 1);
        }
        // just append position to explosionPositions
        else{
          explosionPositions.push(bottomDirectionPos);
        }
      }

      // left
      if(!stopLeft) {
        // get next position in left direction
        let leftDirectionPos = [bomb.PosX - i, bomb.PosY];
        // check if position is wall
        if(this.isItemInArray(this.WallPosition, leftDirectionPos) || leftDirectionPos[0] < 1) {
          stopLeft = true;
        }
        // check if position is obstacle
        else if(this.isItemInArray(this.ObstaclePositions, leftDirectionPos)) {
          console.log("left obstacle", leftDirectionPos);
          stopLeft = true;
          explosionPositions.push(leftDirectionPos);

          // add obstacle to destroyedObstacles
          returnValue.destroyedObstacles.push(leftDirectionPos);
          // remove obstacle from obstacle list
          this.ObstaclePositions.splice(this.getIndexOfArray(this.ObstaclePositions, leftDirectionPos), 1);
        }
        // just append position to explosionPositions
        else{
          explosionPositions.push(leftDirectionPos);
        }
      }

      // right
      if(!stopRight) {
        // get next position in right direction
        let rightDirectionPos = [bomb.PosX + i, bomb.PosY];
        // check if position is wall
        if(this.isItemInArray(this.WallPosition, rightDirectionPos) || rightDirectionPos[0] > this.MaxX - 2) {
          stopRight = true;
        }
        // check if position is obstacle
        else if(this.isItemInArray(this.ObstaclePositions, rightDirectionPos)) {
          console.log("right obstacle", rightDirectionPos);
          explosionPositions.push(rightDirectionPos);
          stopRight = true;

          // add obstacle to destroyedObstacles
          returnValue.destroyedObstacles.push(rightDirectionPos);
          // remove obstacle from obstacle list
          this.ObstaclePositions.splice(this.getIndexOfArray(this.ObstaclePositions, rightDirectionPos), 1);
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

    this.Bombs = this.Bombs.filter(b => b.PosX != bomb.PosX && b.PosY != bomb.PosY);

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
    if(x < 1 || x >= this.MaxX || y < 1 || y >= this.MaxY) {
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

  getIndexOfArray(array, findArray){
    let index = -1;
    array.some((item, i)=>{
      if(JSON.stringify(item) === JSON.stringify(findArray)) {
        index = i;
        return true;
      }
    });
    return index;
  }
}

module.exports = Playground;