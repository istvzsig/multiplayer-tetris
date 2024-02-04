export default class Game {
  constructor(colors, player, arena) {
    this.colors = colors;
    this.canvas = document.createElement("canvas");
    this.canvas.width = 240;
    this.canvas.height = 400;

    this.canvas.id = "tetris";
    this.context = this.canvas.getContext("2d");
    this.context.scale(20, 20);
    this.arena = arena;
    this.player = player;
    this.lastTime = 0;
    this.dropInterval = 500;
    this.player.reset(this.arena);
    this.player.updateScore();

    document.body.firstChild.before(this.canvas);
    this.canvas.before(player.scoreCounter);
  }

  drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        this.context.fillStyle = "blue";
        if (value !== 0) {
          this.context.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
  }

  start(time = 0) {
    const deltaTime = time - this.lastTime;

    this.player.dropCounter += deltaTime;
    if (this.player.dropCounter > this.dropInterval) {
      this.player.drop(this.arena, this.player.dropCounter);
    }

    this.lastTime = time;

    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, this.canvas.clientWidth, this.canvas.height);

    this.drawMatrix(this.arena.matrix, { x: 0, y: 0 });
    this.drawMatrix(this.player.matrix, this.player.pos);
    requestAnimationFrame(this.start.bind(this));
  }
}
