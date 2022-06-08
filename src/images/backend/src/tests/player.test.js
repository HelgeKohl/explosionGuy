const player = require("../classes/game/player");
const player1 = new player("Philipp", 115, 0, 0);

test("set player position to 5,5", () => {
    player1.setNewPosition(5, 5);
    expect(player1.PosX).toBe(5);
    expect(player1.PosY).toBe(5);
});

test("refresh player bomb count", () => {
    player1.BombCount = 0;
    player1.refreshBombCount();
    expect(player1.BombCount).toBe(1);
});