const Bomb = class {
  constructor(posX, posY, bombStrength, timer, explosionListener){
    this.PosX = posX;
    this.PosY = posY;
    this.Strength = bombStrength;
    this.explosionEmitter = explosionListener;

    const self = this
    
    let interval = setInterval(function(){
      console.log("Exploding");
      self.explosionEmitter.emit('Explode', self);
      clearInterval(interval)
    }, timer * 1000);
  }
}

module.exports = Bomb;