export class Player{
  constructor(playerName,playerId){
    this.Playername = playerName;
    this.PlayerId = playerId;
    this.PosX = 0;
    this.PosY = 0;
    this.BombCount = 1;
    this.BombStrength = 1;
  }

  setNewPosition(x,y){
    this.PosX = x;
    this.PosY = y;
  }
}