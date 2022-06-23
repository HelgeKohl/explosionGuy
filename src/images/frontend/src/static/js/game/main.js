import Load from './load.js';
import Bomb  from './bomb.js';
import Player from './player.js';

export default class MainLevel extends Phaser.Scene {

    constructor(socket, data) {
        super('MainLevelScene');
        this.IO = socket;
        this.PlayerId = this.IO.playerId;
        this.gamedata = data;
        this.updateQueue = [];
        this.self = this;
    }
    preload(){
        this.load.bitmapFont('retrogames', 'assets/fonts/retro.png', 'assets/fonts/retro.xml');
    }
    create ()
    {
        // Objekte aus preload json beziehen
        const data = this.gamedata
        const mWidth = data.mWidth + 1;
        const mHeight = data.mHeight + 1;
        const map = this.make.tilemap({ width: mWidth, height: mHeight, tileWidth: 32, tileHeight: 32 });
        const tileset = map.addTilesetImage("tiles");

        // name, tileset, x, y, width, height, tileWidth, tileHeight
        this.background = map.createBlankLayer('layer1', tileset, 0, 0, mWidth, mHeight, 32, 32);
        this.breakable = map.createBlankLayer('layer2', tileset, 0, 0, mWidth, mHeight, 32, 32);
        this.players = {};
        this.bombs = [];
        this.bombCount = 1;

        // Layer beschreiben die Platzierung von den Bildsegmenten per Index auf dem Spielfeld
        const layer1Data = data.layer1Data;
        const layer2Data = data.layer2Data;

        // Tiles zu den Layern hinzufügen
        this.background.putTilesAt(layer1Data, 0, 0);
        this.breakable.putTilesAt(layer2Data, 0, 0);

        // Properties zu den Tiles hinzufügen
        this.addPropToLayer(layer1Data, this.background, true);
        this.addPropToLayer(layer2Data, this.breakable, false);

        // Add text for the current bomb counter
        this.bombText = this.add.bitmapText(8, 8, 'retrogames', 'bombs:' + this.bombCount, 16)

        for (const [id, data] of Object.entries(this.gamedata.player)) {
            let coords = this.translateCoordinates(data.pos);
            this.players[id] = new Player(this, coords[0], coords[1], id);
        }

        this.cursors = this.input.keyboard.createCursorKeys();
        const self = this

        this.IO.socket.on("update", function(args){
            self.updateQueue.push(args);
        });

        this.IO.socket.on("explode", function(args){
            self.updateQueue.push(args);
        })
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
            this.IO.socket.emit("input", {action: 'left'});
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
            this.IO.socket.emit("input", {action: 'right'});
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
            this.IO.socket.emit("input", {action: 'up'});
            let wall = this.background.getTileAtWorldXY(this.players[this.IO.playerId].x, this.players[this.IO.playerId].y - 32, true);
            let obstacle = this.breakable.getTileAtWorldXY(this.players[this.IO.playerId].x, this.players[this.IO.playerId].y - 32, true);
            this.players[this.IO.playerId].play('go-up');
            if (!wall.properties.collide && !obstacle.properties.collide) {
                this.players[this.IO.playerId].y -= 32;
            }
        }
        else if (this.input.keyboard.checkDown(this.cursors.down, 250))
        {
            this.IO.socket.emit("input", {action: 'down'});
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

        if (this.input.keyboard.checkDown(this.cursors.space, 250))
        {
            this.IO.socket.emit("input", {action: 'bomb'});
            // this.players[this.IO.playerId].kill();
        }

        if(this.updateQueue.length > 0){
            let updateData = this.updateQueue.shift();

            if(updateData.input == "bomb"){
                var bomb = new Bomb(this);
                let coords = this.translateCoordinates([updateData.data.PosX, updateData.data.PosY])
                bomb.setPosition(coords[0], coords[1]);

                this.bombs.push({
                    "x": coords[0],
                    "y": coords[1],
                    "bomb": bomb
                });
            }
            else if(["up", "down", "left", "right"].includes(updateData.input)){
                updateData.data.forEach(player => {
                    let coords = this.translateCoordinates(player.data)
                    this.players[player.id].x = coords[0];
                    this.players[player.id].y = coords[1];
                });
            }
            else if(updateData.input == "explosion"){
                console.log(updateData)
                let coords = this.translateCoordinates([updateData.data.bomb.PosX, updateData.data.bomb.PosY])
                this.bombs.find(bomb => bomb.x == coords[0] && bomb.y == coords[1]).bomb.explode(updateData.data.explosionPositions);
                
                updateData.data.destroyedObstacles.forEach(obstacle => {
                    console.log(this.breakable.layer.data)
                    this.breakable.removeTileAt(obstacle[0], obstacle[1], false);
                    console.log(this.breakable.layer.data)
                })
                    
            }
            // Change current bomb count on backend refresh
            this.IO.socket.on("explode", function(args) { // TODO BACKEND Mit sinnvoller Bombenupdate-Methode austauschen
                this.bombCount++;
                this.bombText.setText("Bombs: " + this.bombCount);
            });

            // for(let i = 0; i < this.gamedata.explosions.length; i++){
            //     console.log(this.gamedata.explosions[i]);
            // }
        }
    }

    translateCoordinates(input){
        return [16 + input[0] * 32, 16 + input[1] * 32];
    }
}