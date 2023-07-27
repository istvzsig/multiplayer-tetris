import Player from './modules/Player.mjs';
import { createMatrix, createPiece, matrixCollision } from './modules/functions.mjs';

const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.scale(20, 20);

const colors = [null, "red", "blue", "pink", "orange", "green", "orange"];

const arena = createMatrix(12, 20);

let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000;

const player = new Player();

function clearArena() {
  let rowCount = 1;
  // iterate from bottom to up
  outer: for (let y = arena.length - 1; y > 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;

    player.score += rowCount * 10;
    rowCount *= 2;
  }
}

function draw() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.clientWidth, canvas.height);
  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

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

function mergeMatrix(arena, player) {
  // copy the arena matrix and merge together with the player
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function playerDrop() {
  player.pos.y++;
  if (matrixCollision(arena, player)) {
    player.pos.y--;
    mergeMatrix(arena, player);
    playerReset();
    clearArena();
    player.updateScore();
    // player.pos.y = 0; // when piece reaches the bottom it goes up to the top of the game arena
  }
  dropCounter = 0;
}

function updateGame(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;

  if (dropCounter > dropInterval) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(updateGame);
}

function gameOver() {
  if (matrixCollision(arena, player)) {
    arena.forEach((row) => row.fill(0)); // clear arena
    player.score = 0; // set player score back to 0
    player.updateScore();
  }
}

function playerReset() {
  const pieces = "ILJOTSZ";
  // get random piece
  player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
  player.pos.y = 0; // back to top
  player.pos.x =
    ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
  gameOver();
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
      playerDrop();
      break;
    case "e":
      player.rotate(-1);
      break;
    case "q":
      player.rotate(-1);
      break;
  }
});

player.reset(arena);
player.updateScore();
updateGame();
