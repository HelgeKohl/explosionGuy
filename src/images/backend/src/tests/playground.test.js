const Playground = require('../classes/game/playground');
const player = require("../classes/game/player");

const player1 = new player("Philipp", 115, 3, 3);
const player2 = new player("Helge", 116, 4, 4);
const player3 = new player("Florian", 117, 0, 0);
const playerList = [player1, player2, player3];
const playground1 = new Playground(10, 10, playerList, 0);

test("move player downwards", () => {
    playground1.onInput(115, "down");
    expect(playground1.Players[0].PosX).toBe(3);
    expect(playground1.Players[0].PosY).toBe(4);
});

test("move player upwards", () => {
    playground1.onInput(116, "up");
    expect(playground1.Players[1].PosX).toBe(4);
    expect(playground1.Players[1].PosY).toBe(3);
});

test("move player right", () => {
    playground1.onInput(115, "right");
    expect(playground1.Players[0].PosX).toBe(4);
    expect(playground1.Players[0].PosY).toBe(4);
});

test("move player left", () => {
    playground1.onInput(116, "left");
    expect(playground1.Players[1].PosX).toBe(3);
    expect(playground1.Players[1].PosY).toBe(3);
});

test("move player to invalid position", () => {
    playground1.onInput(117, "left");
    expect(playground1.Players[2].PosX).toBe(0);
    expect(playground1.Players[2].PosY).toBe(0);
});

test("let player place a bomb", () => {
    playground1.onInput(116, "bomb");
    expect(playground1.Players[1].BombCount).toBe(0);
    expect(playground1.Bombs[0].PosX).toBe(3);
    expect(playground1.Bombs[0].PosY).toBe(3);
    expect(playground1.Bombs[0].Strength).toBe(1);
    expect(playground1.Bombs[0].Timer).toBe(3);
});

test("call update function once", () => {
    playground1.update();
    expect(playground1.Bombs[0].Timer).toBe(2);
    expect(playground1.Players[1].BombCount).toBe(1);
    expect(playground1.Tick).toBe(1);
});

test("explode bomb", () => {
    playground1.Tick = 0;
    playground1.update(); //bomb is at timer 1
    expect(playground1.Bombs[0].Timer).toBe(1);
    playground1.onInput(116, "left");
    playground1.Tick = 0;
    playground1.update(); //bomb is at timer 0

    expect(playground1.Players[1].IsAlive).toBe(false);
});