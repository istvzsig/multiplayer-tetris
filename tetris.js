import Game from "./modules/Game.mjs";

const colors = [null, "red", "blue", "pink", "orange", "green", "orange"];
const game = new Game(colors);

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      game.player.move(1);
      break;
    case "a":
      game.player.move(-1);
      break;
    case "s":
      game.player.drop(game.arena);
      break;
    case "e":
      game.player.rotate(game.arena, -1);
      break;
    case "q":
      game.player.rotate(game.arena, -1);
      break;
  }
});

game.start();
