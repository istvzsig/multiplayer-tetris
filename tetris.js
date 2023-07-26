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
    updateScore();
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

function playerMove(dir) {
  player.pos.x += dir;
  if (matrixCollosion(arena, player)) {
    player.pos.x -= dir;
  }
}

// rotate matrix
function rotateMatrix(matrix, dir) {
  // transpose array
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      // array switch
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if (dir > 0) {
    matrix.forEach((row) => row.reverse());
  } else {
    matrix.reverse();
  }
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

function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotateMatrix(player.matrix, dir);
  // check collision
  while (matrixCollosion(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      // rotate back
      rotateMatrix(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      playerMove(1);
      break;
    case "a":
      playerMove(-1);
      break;
    case "s":
      playerDrop();
      break;
    case "e":
      playerRotate(-1);
      break;
    case "q":
      playerRotate(-1);
      break;
  }
});

playerReset();
player.updateScore();
updateGame();
