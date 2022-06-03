const Player = class {
  constructor(playerName, playerId){
    console.log("Init Player");
    console.log("PlayerName: " + playerName);
    console.log("PlayerId: " + playerId);
    
    this.Name = playerName;
    this.Id = playerId;
    this.PosX = 0;
    this.PosY = 0;
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
      this.BombCount = this.BombCount++;
    }
  }
}

module.exports = Player;