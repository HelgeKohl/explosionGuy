import Bomb  from './bomb.js';
import Explosion from './explosion.js';

export default class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, id) {
        super(scene, x, y);
        this.scene = scene;
        this.id = id;
        this.name = "name";
        this.isAlive = true;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setPosition(x,y);
        this.setTexture('player');
        this.body.setCollideWorldBounds(true);
        this.setScale(1);

        var bomboutline1 = this.scene.add.sprite(510, 15, 'bomb-icon').setScale(0.8, 0.8),
            bomboutline2 = this.scene.add.sprite(480, 15, 'bomb-icon').setScale(0.8, 0.8),
            bomboutline3 = this.scene.add.sprite(450, 15, 'bomb-icon').setScale(0.8, 0.8);
        this.bomboutlines = [bomboutline1, bomboutline2, bomboutline3];

        this.scene.time.addEvent({
            delay: 3000,
            callback: ()=>{
                this.bomboutlines[0].play('bomb-outline').setScale(0.8,0.8)
            },
            loop: false
        });

    }
    
    kill(){
        this.setActive(false);
        this.setVisible(false);
    }
}
