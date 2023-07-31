import { createPiece, rotateMatrix } from "./functions.mjs";

export default class Player {
  constructor(arena) {
    this.pos = { x: 0, y: 0 };
    this.matrix = null;
    this.dropCounter = 0;
    this.arena = arena;
    this.score = this.arena.getScore() || 0;
    this.reset();
  }

  drop() {
    this.pos.y++;
    if (this.arena.collide(this)) {
      this.pos.y--;
      this.arena.merge(this);
      this.reset();
      this.score += this.arena.sweep();
    }
    this.dropCounter = 0;
    this.updateScore();
  }

  move(dir) {
    this.pos.x += dir;
    if (this.arena.collide(this)) {
      this.pos.x -= dir;
    }
  }

  reset() {
    const pieces = "ILJOTSZ";
    this.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
    this.pos.y = 0;
    this.pos.x =
      ((this.arena.matrix[0].length / 2) | 0) -
      ((this.matrix[0].length / 2) | 0);
    if (this.arena.collide(this)) {
      this.arena.clear();
      this.score = 0;
    }
  }

  rotate(dir) {
    const pos = this.pos.x;
    let offset = 1;
    rotateMatrix(this.matrix, dir);
    // check collision
    while (this.arena.collide(this)) {
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

  updateScore() {
    console.log(this.score);
    document.getElementById("playerScore").innerText = `SCORE: ${this.score}`;
  }
}
