import Game from "./modules/Game.mjs";
import Arena from "./modules/Arena.mjs";
import Player from "./modules/Player.mjs";

const colors = [null, "red", "blue", "pink", "orange", "green", "orange"];
const arena = new Arena(12, 20);
const player  = new Player(arena);
const game = new Game(colors, player, arena);

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      player.move(1);
    case "a":
      player.move(-1);
    case "s":
      player.drop(arena);
    case "e":
      player.rotate(arena, -1);
    case "q":
      player.rotate(arena, -1);
  }
});

game.start();
