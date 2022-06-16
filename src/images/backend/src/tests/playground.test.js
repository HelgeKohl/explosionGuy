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

test("move player outside board", () => {
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

    expect(playground1.Tick).toBe(1);
    expect(playground1.Players[1].IsAlive).toBe(false);
});

test("move dead player", () => {
    playground1.onInput(116, "left");
    expect(playground1.Players[1].PosX).toBe(2);
    expect(playground1.Players[1].PosY).toBe(3);
});

test("let player place a bomb with no bombs left", () => {
    playground1.Players[0].BombCount = 0;
    playground1.onInput(115, "bomb");
    expect(playground1.Players[0].BombCount).toBe(0);
    expect(playground1.Bombs.length).toBe(0);
});

test("call update fuction with (timer % 60) != 0", () => {
    playground1.update();
    expect(playground1.Players[0].BombCount).toBe(0);
});

//neuer Playground für fehlende Move checks
const player4 = new player("Patrice", 120, 0, 0);
const player5 = new player("Anastasia", 121, 1, 0);
const playerList1 = [player4, player5];
const playground2 = new Playground(10, 10, playerList1, 1);
playground2.ObstaclePositions[0] = [0,1];

test("move player right, block by other player", () => {
    playground2.onInput(120, "right");
    expect(playground2.Players[0].PosX).toBe(0);
    expect(playground2.Players[0].PosY).toBe(0);
});

test("move player right, block by obstacle", () => {
    playground2.onInput(120, "down");
    expect(playground2.Players[0].PosX).toBe(0);
    expect(playground2.Players[0].PosY).toBe(0);
});

test("move player right, block by bomb", () => {
    playground2.onInput(121, "bomb");
    playground2.onInput(121, "right");
    playground2.onInput(120, "right");
    expect(playground2.Players[0].PosX).toBe(0);
    expect(playground2.Players[0].PosY).toBe(0);
});