const player = require("../classes/game/player");

describe("'Playertests'", function () {
test("set player position to 5,5", () => {
    //arrange
    const player1 = new player("Philipp", 115, 0, 0);
    player1.interruptInterval();
    //act
    player1.setNewPosition(5, 5);
    //assert
    expect(player1.PosX).toBe(5);
    expect(player1.PosY).toBe(5);
});

test("refresh player bomb count", () => {
    //arrange
    const player1 = new player("Philipp", 115, 0, 0);
    player1.interruptInterval();
    //act
    player1.BombCount = 0;
    player1.refreshBombCount();
    //assert
    expect(player1.BombCount).toBe(1);
});

test("try moving a dead player", () => {
    //arrange
    const player1 = new player("Philipp", 115, 0, 0);
    player1.interruptInterval();
    //act
    player1.IsAlive = false;
    player1.setNewPosition(4,4);
    //assert
    expect(player1.PosX).toBe(0);
    expect(player1.PosY).toBe(0);
});
})