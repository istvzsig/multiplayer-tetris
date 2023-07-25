import { createPiece, matrixCollosion } from "./functions.mjs";

export default class Player {
  constructor() {
    this.pos = { x: 0, y: 0 };
    this.matrix = null;
    this.score = 0;
    this.dropCounter = 0;
    this.dropInterval = 1000;
  }

  drop(arena) {
    this.pos.y++;
    if (matrixCollosion(arena, this)) {
      this.pos.y--;
      mergeMatrix(arena, this);
      this.reset();
      clearArena();
      this.updateScore();
      // this.pos.y = 0; // when piece reaches the bottom it goes up to the top of the game arena
    }
    this.dropCounter = 0;
  }

  move(dir) {
    this.pos.x += dir;
    if (matrixCollosion(arena, this)) {
      this.pos.x -= dir;
    }
  }

  reset(arena, func) {
    const pieces = "ILJOTSZ";
    // get random piece
    this.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
    this.pos.y = 0; // back to top
    this.pos.x = ((arena[0].length / 2) | 0) - ((this.matrix[0].length / 2) | 0);
    func();
  }

  rotate(dir) {
    const pos = this.pos.x;
    let offset = 1;
    rotateMatrix(this.matrix, dir);
    // check collision
    while (matrixCollosion(arena, this)) {
      this.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > this.matrix[0].length) {
        // rotate back
        rotateMatrix(this.matrix, -dir);
        this.pos.x = pos;
        return;
      }
    }
  }

  update(deltaTime) {
    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.drop();
    }
  }

  updateScore() {
    document.getElementById("playerScore").innerText = this.score;
  }
}