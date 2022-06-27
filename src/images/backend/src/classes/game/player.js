const Player = class {
  constructor(playerName, playerId, playerPosX, playerPosY, explosionListener){
    console.log("Init Player");
    console.log("PlayerName: " + playerName);
    console.log("PlayerId: " + playerId);
    
    this.Name = playerName;
    this.Id = playerId;
    this.PosX = playerPosX;
    this.PosY = playerPosY;
    this.MaxBombCount = 3;
    this.BombCount = 1;
    this.BombStrength = 3;
    this.IsAlive = true;
    const self = this;
    this.explosionEmitter = explosionListener;

    this.interval = setInterval(function(){
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
      console.log("refresh Bomb");
      this.BombCount++;
      this.explosionEmitter.emit('Refresh', this);
    }
  }

  interruptInterval(){
    console.log("Interrupt wird ausgeführt");
    clearInterval(this.interval);
  }
}

module.exports = Player;