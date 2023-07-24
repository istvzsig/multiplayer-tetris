const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.scale(20, 20);

const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],
];

function draw() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.clientWidth, canvas.height);
  drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = "red";
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000;

const player = {
  matrix: matrix,
  pos: {x: 0, y: 0},
}

function playerDrop() {
  player.pos.y++;
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

document.addEventListener('keydown', event => {
  switch(event.key) {
    case 'd':
      player.pos.x++;
      break;
    case 'a':
      player.pos.x--;
      break;
    case 's':
      playerDrop();
  }
})

updateGame();

