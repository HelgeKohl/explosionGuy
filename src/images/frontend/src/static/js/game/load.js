export default class Load extends Phaser.Scene {
    constructor() {
        super('Loading');
    }
    preload () {
        this.load.image("tiles", "assets/tilemaps/tileBild.png");
        this.load.spritesheet("player-movement", "assets/player_movement.png",{frameWidth: 32,frameHeight: 32})
        this.load.image("player", "assets/player.png")
        //Daten aus erstellter JSON Tilemap beziehen
        this.load.spritesheet("bomb", "assets/bomb.png",{frameWidth: 32,frameHeight: 32});
        this.load.spritesheet("explosion", "assets/explosion.png",{frameWidth: 32,frameHeight: 32});
        this.load.spritesheet("game-over", "assets/game_over.png",{frameWidth: 254,frameHeight: 106});
        this.load.spritesheet("button", "assets/button.png",{frameWidth: 174,frameHeight: 57});

        this.load.bitmapFont('retrogames', 'assets/fonts/retro.png', 'assets/fonts/retro.xml');

    }

    create() {
        //Animationen
        //Bombe & Explosions Animation
        this.anims.create({key: 'bomb-idle',
            frames: this.anims.generateFrameNumbers('bomb', {start: 0,end: 1}),
            repeat: -1,
            frameRate: 2
        });

        this.anims.create({key: 'boom',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0,end: 7}),
            repeat: 0,
            frameRate: 5
        });

        this.anims.create({key: 'go-left',
            frames: this.anims.generateFrameNumbers('player-movement', {start: 1,end: 2}),
            repeat: -1,
            frameRate: 5
        });
        this.anims.create({key: 'go-right',
            frames: this.anims.generateFrameNumbers('player-movement', {start: 3,end: 4}),
            repeat: -1,
            frameRate: 5
        });
        this.anims.create({key: 'go-down',
            frames: this.anims.generateFrameNumbers('player-movement', {start: 5,end: 6}),
            repeat: -1,
            frameRate: 5
        });
        this.anims.create({key: 'go-up',
            frames: this.anims.generateFrameNumbers('player-movement', {start: 7,end: 8}),
            repeat: -1,
            frameRate: 5
        });
        this.anims.create({key: 'game-over',
            frames: this.anims.generateFrameNumbers('game-over', {start: 0,end: 8}),
            repeat: 0,
            frameRate: 4
        });

        this.scene.start('MainLevelScene');
    }
}
