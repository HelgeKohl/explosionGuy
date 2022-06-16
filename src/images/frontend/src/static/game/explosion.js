class Explosion extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene);

        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);

        this.once('animationcomplete', ()=>  {
            this.destroyObj(this);
        });
    }
    destroyObj(obj){
        obj.setActive(false);
        obj.setVisible(false);
    }
}

export default Explosion;