import Arena from './modules/Arena.mjs';
import Player from './modules/Player.mjs';

const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.scale(20, 20);

const colors = [null, "red", "blue", "pink", "orange", "green", "orange"];

const arena = new Arena(12, 20);
const player = new Player(arena);

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

let lastTime = 0;
let dropInterval = 1000;

function updateGame(time = 0) {
  const deltaTime = time - lastTime;
  
  player.dropCounter += deltaTime;
  if(player.dropCounter > dropInterval) {
    player.drop(arena, player.dropCounter);
  }
  
  lastTime = time;

  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.clientWidth, canvas.height);

  drawMatrix(arena.matrix, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);

  requestAnimationFrame(updateGame);
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      player.move(1);
      break;
    case "a":
      player.move(-1);
      break;
    case "s":
      player.drop(arena);
      break;
    case "e":
      player.rotate(arena, -1);
      break;
    case "q":
      player.rotate(arena, -1);
      break;
  }
});

player.reset(arena);
player.updateScore();
updateGame();
