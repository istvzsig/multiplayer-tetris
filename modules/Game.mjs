/* This module exports the Game class, which represents the main game logic for Tetris.
   It handles drawing the game on the canvas, updating the game state, and managing player actions.

   Usage:
   import Game from "./Game.mjs";
   const colors = [...]; // Define your colors array
   const game = new Game(colors);
   game.start();
*/

import Arena from "./Arena.mjs";
import Player from "./Player.mjs";

export default class Game {
  constructor(colors) {
   this.colors = colors;
    this.canvas = document.getElementById("tetris");
    this.context = this.canvas.getContext("2d");
    this.context.scale(20, 20);
    this.arena = new Arena(12, 20);
    this.player = new Player(this.arena);
    this.lastTime = 0;
    this.dropInterval = 500;
    this.player.reset(this.arena);
    this.player.updateScore();
  }

  drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.context.fillStyle = this.colors[value];
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
