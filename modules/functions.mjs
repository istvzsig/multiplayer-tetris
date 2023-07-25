export function matrixCollosion(arena, player) {
 // matrix and offset
 const [m, o] = [player.matrix, player.pos];
 for (let y = 0; y < m.length; ++y) {
   for (let x = 0; x < m[y].length; ++x) {
     if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
       return true;
     }
   }
 }
 return false;
}

export function createPiece(type) {
 if (type === "T") {
   return [
     [0, 0, 0],
     [1, 1, 1],
     [0, 1, 0],
   ];
 }
 if (type === "O") {
   return [
     [2, 2],
     [2, 2],
   ];
 }
 if (type === "L") {
   return [
     [0, 3, 0],
     [0, 3, 0],
     [0, 3, 3],
   ];
 }
 if (type === "J") {
   return [
     [0, 4, 0],
     [0, 4, 0],
     [4, 4, 0],
   ];
 }
 if (type === "I") {
   return [
     [0, 5, 0, 0],
     [0, 5, 0, 0],
     [0, 5, 0, 0],
     [0, 5, 0, 0],
   ];
 }
 if (type === "S") {
   return [
     [0, 6, 6],
     [6, 6, 0],
     [0, 0, 0],
   ];
 }
 if (type === "Z") {
   return [
     [7, 7, 0],
     [0, 7, 7],
     [0, 0, 0],
   ];
 }
}

export function createMatrix(w, h) {
  const matrix = [];
  // while height is not 0
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}
