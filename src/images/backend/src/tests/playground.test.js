const Playground = require('../classes/game/playground');
const player = require("../classes/game/player");

const player1 = new player("Philipp", 115, 3, 3);
const player2 = new player("Helge", 116, 4, 4);
const playerList = [player1, player2];
const playground1 = new Playground(10, 10, playerList, 3);

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