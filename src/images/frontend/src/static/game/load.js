class Load extends Phaser.Scene {
    constructor() {
        super('Loading');
    }
    preload () {
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.image("tiles", "assets/tilemaps/tileBild.png");
        this.load.spritesheet("player-movement", "assets/player_movement.png",{frameWidth: 32,frameHeight: 32})
        this.load.image("player", "assets/player.png")
        //Daten aus erstellter JSON Tilemap beziehen
        this.load.spritesheet("bomb", "assets/bomb.png",{frameWidth: 32,frameHeight: 32});
        this.load.spritesheet("explosion", "assets/explosion.png",{frameWidth: 32,frameHeight: 32});

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
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

        this.scene.start('MainLevelScene');
    }
}

export default Load;