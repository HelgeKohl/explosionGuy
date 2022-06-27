const Bomb = class {
  constructor(posX, posY, bombStrength, timer, explosionListener){
    this.PosX = posX;
    this.PosY = posY;
    this.Strength = bombStrength;
    this.explosionEmitter = explosionListener;

    const self = this
    
    this.interval = setInterval(function(){
      console.log("Exploding");
      self.explosionEmitter.emit('Explode', self);
      clearInterval(self.interval)
    }, timer * 1000);
  }

  interruptInterval(){
    console.log("Interrupt wird ausgeführt");
    clearInterval(this.interval);
  }
}

module.exports = Bomb;