import Explosion from './explosion.js';

export default class Bomb extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.setTexture('bomb').play('bomb-idle');
        this.body.setCollideWorldBounds(true);
        this.setScale(1);
        this.body.setBounce(0.8);
    }
    explode() {
        let explosion = new Explosion(this.scene)
        console.log("Explosion")
        this.destroyObj(this)
    }
    destroyObj(obj){
        obj.setActive(false);
        obj.setVisible(false);
    }
}
