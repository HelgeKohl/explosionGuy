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
        this.explsound = this.scene.sound.add("explosion", { loop: false });
    }
    explode(explosionPositions) {
        explosionPositions.forEach(position => {
            console.log(position);
            this.explsound.play();
            let coords = this.translateCoordinates(position);
            let explosion = new Explosion(this.scene)
            explosion.setPosition(coords[0], coords[1]);
        });
        console.log("Explosion")
        this.destroyObj(this);
    }
    destroyObj(obj){
        obj.setActive(false);
        obj.setVisible(false);
    }

    translateCoordinates(input){
        return [16 + input[0] * 32, 16 + input[1] * 32];
    }
}
