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
    const self = this;

    let interval = setInterval(function(){
      self.refreshBombCount();
    }, 3000);
  }

  setNewPosition(x,y){
    if(this.IsAlive){
      this.PosX = x;
      this.PosY = y;
    }
  }

  refreshBombCount(){
    if(this.BombCount < this.MaxBombCount && this.IsAlive){
      console.log("refresh Bomb")
      this.BombCount++;
    }
  }
}

module.exports = Player;