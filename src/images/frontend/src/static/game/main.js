import Load from './load.js';
import Player from './player.js';

export default class MainLevel extends Phaser.Scene {

    constructor() {
        super('MainLevelScene');
    }
    preload(){
        this.load.json('jsonData', "json/preloadData.json");
    }
    create ()
    {
        // Objekte aus preload json beziehen
        const data = this.cache.json.get('jsonData').preloadData;
        const mWidth = data.mWidth;
        const mHeight = data.mHeight;
        const map = this.make.tilemap({ width: mWidth, height: mHeight, tileWidth: 32, tileHeight: 32 });
        const tileset = map.addTilesetImage("tiles");
        this.background = map.createBlankLayer('layer1', tileset, 0, 0, mWidth, mHeight, 32, 32);
        this.breakable = map.createBlankLayer('layer2', tileset, 0, 0, mWidth, mHeight, 32, 32);

        // Layer beschreiben die Platzierung von den Bildsegmenten per Index auf dem Spielfeld
        const layer1Data = data.layer1Data;
        const layer2Data = data.layer2Data;

        // Tiles zu den Layern hinzufügen
        this.background.putTilesAt(layer1Data, 0, 0);
        this.breakable.putTilesAt(layer2Data, 0, 0);

        // Properties zu den Tiles hinzufügen
        this.addPropToLayer(layer1Data, this.background, true);
        this.addPropToLayer(layer2Data, this.breakable, false);

        this.player = new Player(this, 48, 48);
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
            IO.socket.emit("input", {action: 'move', direction: 'left'});
            // EIgenschaften des zu begehenden Tiles zuordnen
            this.wall = this.walls.getTileAtWorldXY(this.player.x - 32, this.player.y, true);
            this.breakable = this.obstacles.getTileAtWorldXY(this.player.x - 32, this.player.y, true);
            this.player.play('go-left');
            // Wenn Collide-Eigenschaften des zu begehenden Feldes Falsch sind darf gegangen werden
            if (!this.wall.properties.collide && !this.breakable.properties.collide)
            {
                this.player.x -= 32;
            }

        }
        else if (this.input.keyboard.checkDown(this.cursors.right, 250))
        {
            IO.socket.emit("input", {action: 'move', direction: 'right'});
            this.wall = this.walls.getTileAtWorldXY(this.player.x + 32, this.player.y, true);
            this.breakable = this.obstacles.getTileAtWorldXY(this.player.x + 32, this.player.y, true);
            this.player.play('go-right');
            if (!this.wall.properties.collide && !this.breakable.properties.collide)
            {
                this.player.x += 32;

            }
        }

        else if (this.input.keyboard.checkDown(this.cursors.up, 250))
        {
            IO.socket.emit("input", {action: 'move', direction: 'up'});
            this.wall = this.walls.getTileAtWorldXY(this.player.x, this.player.y - 32, true);
            this.breakable = this.obstacles.getTileAtWorldXY(this.player.x, this.player.y - 32, true);
            this.player.play('go-up');
            if (!this.wall.properties.collide && !this.breakable.properties.collide) {
                this.player.y -= 32;
            }

        }
        else if (this.input.keyboard.checkDown(this.cursors.down, 250))
        {
            IO.socket.emit("input", {action: 'move', direction: 'down'});
            this.wall = this.walls.getTileAtWorldXY(this.player.x, this.player.y + 32, true);
            this.breakable = this.obstacles.getTileAtWorldXY(this.player.x, this.player.y + 32, true);
            this.player.play('go-down');
            if (!this.wall.properties.collide && !this.breakable.properties.collide)
            {
                this.player.y += 32;

            }
        }

        if (!this.input.keyboard.isDown)
        {
            this.player.anims.stop();

        }

        if (this.input.keyboard.checkDown(this.cursors.space))
        {
            IO.socket.emit("input", {action: 'bomb'});
            this.player.dropBomb(this.player.x, this.player.y, isExploding, breakables);
        }
    }
}