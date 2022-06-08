const Bomb = class {
  constructor(posX, posY, bombStrength, timer){
    this.PosX = posX;
    this.PosY = posY;
    this.Strength = bombStrength;
    this.Timer = timer;
  }
}

module.exports = Bomb;