import Load from './load.js';
import Player from './player.js';

export default class MainLevel extends Phaser.Scene {

    constructor(socket, data) {
        super('MainLevelScene');
        this.IO = socket;
        this.PlayerId = this.IO.playerId;
        this.gamedata = data;
        this.newUpdateAvailable = false;
    }
    preload(){

    }
    create ()
    {
        // Objekte aus preload json beziehen
        const data = this.gamedata
        const mWidth = data.mWidth;
        const mHeight = data.mHeight;
        const map = this.make.tilemap({ width: mWidth, height: mHeight, tileWidth: 32, tileHeight: 32 });
        const tileset = map.addTilesetImage("tiles");
        this.background = map.createBlankLayer('layer1', tileset, 0, 0, mWidth, mHeight, 32, 32);
        this.breakable = map.createBlankLayer('layer2', tileset, 0, 0, mWidth, mHeight, 32, 32);
        this.players = {};

        // Layer beschreiben die Platzierung von den Bildsegmenten per Index auf dem Spielfeld
        const layer1Data = data.layer1Data;
        const layer2Data = data.layer2Data;

        // Tiles zu den Layern hinzufügen
        this.background.putTilesAt(layer1Data, 0, 0);
        this.breakable.putTilesAt(layer2Data, 0, 0);

        // Properties zu den Tiles hinzufügen
        this.addPropToLayer(layer1Data, this.background, true);
        this.addPropToLayer(layer2Data, this.breakable, false);

        for (const [id, data] of Object.entries(this.gamedata.player)) {
            this.players[id] = new Player(this, data.pos[0]*48, data.pos[1]*48, id);
        }

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    // Fügt zu einem Object eine boolean-Eigenschaft hinzu
    add_properties (object, property)
    {
        Object.defineProperty(object.properties, property, {
            value: true
        });
    }

    // Fügt die Properties automatisch in den Layer hinzu, nach Tile-Typ
    addPropToLayer (layData, layer, background)
    {
        for (let x = 0; x < layData[0].length; x++) {
            for (let y = 0; y < layData.length; y++) {
                const element = layData[y][x];
                const tile = layer.getTileAt([x], [y], true);
                if(background)
                {
                    if(element == 1)
                    {
                        this.add_properties(tile, "collide");
                    }
                }
                if(!background)
                {
                    if(element == 2)
                    {
                        this.add_properties(tile, "collide");
                        this.add_properties(tile, "destroyable");
                    }
                }
            }
        }
    }

    update ()
    {
        if (this.input.keyboard.checkDown(this.cursors.left, 250))
        {
            this.IO.socket.emit("input", {action: 'move', direction: 'left'});
            // EIgenschaften des zu begehenden Tiles zuordnen
            let wall = this.background.getTileAtWorldXY(this.players[this.IO.playerId].x - 32, this.players[this.IO.playerId].y, true);
            let obstacle = this.breakable.getTileAtWorldXY(this.players[this.IO.playerId].x - 32, this.players[this.IO.playerId].y, true);
            this.players[this.IO.playerId].play('go-left');
            // Wenn Collide-Eigenschaften des zu begehenden Feldes Falsch sind darf gegangen werden
            if (!wall.properties.collide && !obstacle.properties.collide)
            {
                this.players[this.IO.playerId].x -= 32;
            }

        }
        else if (this.input.keyboard.checkDown(this.cursors.right, 250))
        {
            this.IO.socket.emit("input", {action: 'move', direction: 'right'});
            let wall = this.background.getTileAtWorldXY(this.players[this.IO.playerId].x + 32, this.players[this.IO.playerId].y, true);
            let obstacle = this.breakable.getTileAtWorldXY(this.players[this.IO.playerId].x + 32, this.players[this.IO.playerId].y, true);
            this.players[this.IO.playerId].play('go-right');
            if (!wall.properties.collide && !obstacle.properties.collide)
            {
                this.players[this.IO.playerId].x += 32;
            }
        }

        else if (this.input.keyboard.checkDown(this.cursors.up, 250))
        {
            this.IO.socket.emit("input", {action: 'move', direction: 'up'});
            let wall = this.background.getTileAtWorldXY(this.players[this.IO.playerId].x, this.players[this.IO.playerId].y - 32, true);
            let obstacle = this.breakable.getTileAtWorldXY(this.players[this.IO.playerId].x, this.players[this.IO.playerId].y - 32, true);
            this.players[this.IO.playerId].play('go-up');
            if (!wall.properties.collide && !obstacle.properties.collide) {
                this.players[this.IO.playerId].y -= 32;
            }
        }
        else if (this.input.keyboard.checkDown(this.cursors.down, 250))
        {
            this.IO.socket.emit("input", {action: 'move', direction: 'down'});
            let wall = this.background.getTileAtWorldXY(this.players[this.IO.playerId].x, this.players[this.IO.playerId].y + 32, true);
            let obstacle = this.breakable.getTileAtWorldXY(this.players[this.IO.playerId].x, this.players[this.IO.playerId].y + 32, true);
            this.players[this.IO.playerId].play('go-down');
            if (!wall.properties.collide && !obstacle.properties.collide)
            {
                this.players[this.IO.playerId].y += 32;

            }
        }

        if (!this.input.keyboard.isDown)
        {
            this.players[this.IO.playerId].anims.stop();
        }

        if (this.input.keyboard.checkDown(this.cursors.space))
        {
            this.IO.socket.emit("input", {action: 'bomb'});
            this.players[this.IO.playerId].dropBomb(this.players[this.IO.playerId].x, this.players[this.IO.playerId].y, isExploding, breakables);
        }

        if(this.newUpdateAvailable){
            this.newUpdateAvailable == false;
        }
    }
}