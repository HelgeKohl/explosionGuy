import Load from '../game/load.js';
import MainLevel from "../game/main.js";
const config = {
    title: 'Explosion Guy',
    type: Phaser.AUTO,
    width: 544, //17 x 32
    height: 416, //13 x 32
    autoCenter: true,
    // Bildschirm ausfüllen
    scale: {
        mode: Phaser.Scale.FIT
    },
    scene: [Load,MainLevel],
    physics: {
        default:"arcade", arcade:{
            debug:true
        }
    }
};
const game = new Phaser.Game(config);

