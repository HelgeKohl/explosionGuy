export default class Explosion extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.setTexture('explosion').play('boom');
        this.scene.cameras.main.shake(200);

        this.once('animationcomplete', ()=>  {
            this.destroyObj(this);
        });
    }
    destroyObj(obj){
        obj.setActive(false);
        obj.setVisible(false);
    }
}
