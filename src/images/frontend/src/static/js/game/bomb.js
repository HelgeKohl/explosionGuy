import Player  from './player.js';
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
    explode(player, breakables) {
        let explosion = new Explosion(this)
        for(b of breakables){
            this.scene.physics.add.collider(explosion, b);
            this.scene.physics.add.overlap(explosion, b, this.kill(b), null, this);
        }

        this.scene.physics.add.collider(explosion, player);
        this.scene.physics.add.overlap(explosion, player, this.destroyObj(player), null, this);

    }
    destroyObj(obj){
        obj.setActive(false);
        obj.setVisible(false);
    }
}
