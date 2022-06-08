const Player = class {
  constructor(playerName, playerId, playerPosX, playerPosY){
    console.log("Init Player");
    console.log("PlayerName: " + playerName);
    console.log("PlayerId: " + playerId);
    
    this.Name = playerName;
    this.Id = playerId;
    this.PosX = playerPosX;
    this.PosY = playerPosY;
    this.MaxBombCount = 3;
    this.BombCount = 1;
    this.BombStrength = 1;
    this.IsAlive = true;
  }

  setNewPosition(x,y){
    if(this.IsAlive){
      this.PosX = x;
      this.PosY = y;
    }
  }

  refreshBombCount(){
    if(this.BombCount < this.MaxBombCount && this.IsAlive){
      this.BombCount++;
    }
  }
}

module.exports = Player;