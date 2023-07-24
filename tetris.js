const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.scale(20, 20);

const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],
];

const player = {
  matrix: matrix,
  pos: {x: 0, y: 0},
};

const arena = createMatrix(12, 20);

let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000;

function draw() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.clientWidth, canvas.height);
  drawMatrix(arena, {x: 0, y:0});
  drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = "lime";
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function mergeMatrix(arena, player) {
  // copy the arena matrix and merge together with the player
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    })
  });
}

function matrixCollosion(arena, player) {
  // matrix and offset
  const [m, o] = [player.matrix, player.pos];
  for(let y = 0; y < m.length; ++y) {
    for(let x = 0; x < m[y].length; ++x) {
      if(m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function createMatrix(w, h) {
  const matrix = [];
  // while height is not 0
  while(h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function playerDrop() {
  player.pos.y++;
  if(matrixCollosion(arena, player)) {
    player.pos.y--;
    mergeMatrix(arena, player);
    player.pos.y = 0; // when piece reaches the bottom it goes up to the top of the game arena
  }
  dropCounter = 0;
}

function updateGame(time=0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;

  if(dropCounter > dropInterval) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(updateGame);
}

function playerMove(dir) {
  player.pos.x += dir;
  if(matrixCollosion(arena, player)) {
    player.pos.x -= dir;
  }
}

// rotate matrix
function rotateMatrix(matrix, dir) {
  // transpose array
  for(let y =0; y < matrix.length; ++y) {
    for(let x = 0; x < y; ++x) {
      // array switch
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if(dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}

function playerRotate(dir) {
  rotateMatrix(player.matrix, dir);
}

document.addEventListener('keydown', event => {
  switch(event.key) {
    case 'd':
      playerMove(1);
      break;
    case 'a':
      playerMove(-1);
      break;
    case 's':
      playerDrop();
      break;
    case 'e':
      playerRotate(-1);
      break;
    case 'q':
      playerRotate(-1);
      break;
  }
})

updateGame();

