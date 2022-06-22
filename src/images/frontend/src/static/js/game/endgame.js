export default class Endgame extends Phaser.Scene {
    constructor() {
        super('Ending');
    }
    init(data){
        this.isAlive = data.isAlive;
    }

    create() {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;

        this.centerx = this.width/2;
        this.centery = this.height/2;

        this.overlay = this.add.graphics();
        this.overlay.fillStyle(0x222222, 0.7);
        this.overlay.fillRect(0, 0, this.width, this.height);

        this.box = this.add.graphics();
        this.box.fillStyle(0x242222);
        this.boxX = this.centerx - 400/2;
        this.boxY = this.centery - 200/2;
        this.box.fillRect(this.boxX,this.boxY,400,200);


        if(!this.isAlive){
            this.gameover();
        }
        if(this.isAlive){
            this.winner();
        }


    }
    gameover(){
        console.log('Game Over');
        var img  = this.add.sprite(this.centerx, this.centery, 'game-over');
        img.setScale(1.3, 1.3);
        img.play('game-over');
        img.once('animationcomplete', ()=>  {
            img.destroy();
            this.openWindow(false);
        });

    }
    winner(){
        var img  = this.add.sprite(this.width/2, this.height/2, 'you-win');
        img.play('you-win');
        img.setScale(1.5, 1.5);
        img.once('animationcomplete', ()=>  {
            img.destroy();
            this.openWindow(true);
        });

    }
    openWindow(win) {
        var label = win ? 'You Win!' : 'You Lose!';
        var h1 = this.add.bitmapText(this.centerx -110, this.centery - 50, 'retrogames', label, 25);
        var h2 = this.add.bitmapText(this.centerx -105, this.centery - 5, 'retrogames', 'return to lobby?', 10);

        var returnToLobby = new Button(this,this.centerx - 80, this.centery + 60,'yes');
        var watchGame = new Button(this,this.centerx + 80 , this.centery + 60 ,'no');


        watchGame.once('pointerdown', () => {
            this.scene.stop();
        });

        returnToLobby.once('pointerdown', () => {
            //return to lobby.html
        });
    }


}

class Button extends Phaser.GameObjects.Sprite {
    constructor(scene,x, y, label) {
        super(scene, x, y, 'button');
        this.scene = scene;
        this.scene.add.existing(this);
        this.setPosition(x,y);
        this.setScale(0.5, 0.35);
        this.setInteractive();

        this.on('pointerover', function (pointer) {
            this.setTint(0xff0000);
        });
        this.on('pointerout', function (pointer) {
            this.clearTint();
        });

        this.text = this.scene.add.bitmapText(x/2 ,y/2 , 'retrogames', label, 8);
        Phaser.Display.Align.In.Center(this.text, this);
    }
    kill() {
        this.setVisible(false);
        this.text.setVisible(false);
    }
}
