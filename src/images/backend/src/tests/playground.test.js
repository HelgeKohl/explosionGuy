const Playground = require('../classes/game/playground');
const player = require("../classes/game/player");

describe('PlaygroundMovement', function () {
    //arrange
    const player1 = new player("Philipp", 115, 1, 1);
    const playerList = [player1];
    const playground1 = new Playground(10, 10, playerList, 0);
    player1.interruptInterval();
    playground1.Players[0].interruptInterval();

test("move player downwards", () => {
    //act
    playground1.onInput(115, "down");
    //assert
    expect(playground1.Players[0].PosX).toBe(1);
    expect(playground1.Players[0].PosY).toBe(2);
});

test("move player upwards", () => {
    //act
    playground1.onInput(115, "up");
    //assert
    expect(playground1.Players[0].PosX).toBe(1);
    expect(playground1.Players[0].PosY).toBe(1);
});

test("move player right", () => {
    //act
    playground1.onInput(115, "right");
    //assert
    expect(playground1.Players[0].PosX).toBe(2);
    expect(playground1.Players[0].PosY).toBe(1);
});

test("move player left", () => {
    //act
    playground1.onInput(115, "left");
    //assert
    expect(playground1.Players[0].PosX).toBe(1);
    expect(playground1.Players[0].PosY).toBe(1);
});

test("move player outside board", () => {
    //act
    playground1.onInput(115, "left");
    //assert
    expect(playground1.Players[0].PosX).toBe(1);
    expect(playground1.Players[0].PosY).toBe(1);
});

test("let player place a bomb", () => {
    //act
    playground1.onInput(115, "bomb");
    playground1.Bombs[0].interruptInterval();
    //assert
    expect(playground1.Players[0].BombCount).toBe(0);
    expect(playground1.Bombs[0].PosX).toBe(1);
    expect(playground1.Bombs[0].PosY).toBe(1);
    expect(playground1.Bombs[0].Strength).toBe(3);
});
})

describe('InvalidMoves', function () {
    //arrange
    const player1 = new player("Philipp", 115, 1, 1);
    const player2 = new player("Helge", 116, 1, 1);
    const playerList = [player1, player2];
    const playground1 = new Playground(10, 10, playerList, 0);
    player1.interruptInterval();
    playground1.Players[0].interruptInterval();
    player2.interruptInterval();
    playground1.Players[1].interruptInterval();

test("move dead player", () => {
    //arrange
    playground1.Players[0].IsAlive = false;
    //act
    playground1.onInput(115, "left");
    //assert
    expect(playground1.Players[0].PosX).toBe(1);
    expect(playground1.Players[0].PosY).toBe(1);
});

test("let player place a bomb with no bombs left", () => {
    //arrange
    playground1.Players[0].BombCount = 0;
    //act
    playground1.onInput(115, "bomb");
    //assert
    expect(playground1.Players[0].BombCount).toBe(0);
    expect(playground1.Bombs.length).toBe(0);
});

test("move player right, block by other player", () => {
    //arrange
    playground1.Players[1].setNewPosition(2,1);
    //act
    playground1.onInput(115, "right");
    //assert
    expect(playground1.Players[0].PosX).toBe(1);
    expect(playground1.Players[0].PosY).toBe(1);
});

test("move player right, block by obstacle", () => {
    //act
    playground1.onInput(116, "down");
    //assert
    expect(playground1.Players[1].PosX).toBe(2);
    expect(playground1.Players[1].PosY).toBe(1);
});

test("move player right, block by bomb", () => {
    //arrange
    playground1.onInput(116, "bomb");
    playground1.Bombs[0].interruptInterval();
    playground1.onInput(116, "right");
    //act
    playground1.onInput(115, "right");
    //assert
    expect(playground1.Players[0].PosX).toBe(1);
    expect(playground1.Players[0].PosY).toBe(1);
});

test("place bomb on other bomb", () => {
    //arrange
    playground1.onInput(116, "bomb");
    playground1.Bombs[0].interruptInterval();
    //act
    playground1.onInput(116, "bomb");
    //assert
    expect(playground1.Bombs.length).toBe(1);
});
})



