import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";
import { Cell, Universe } from "wasm-game-of-life";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const universe = Universe.new();
const width = universe.width();
const height = universe.height();

// Give the canvas room for a 1px border around each cell.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext("2d");

function lineOffset(i) {
  return i * (CELL_SIZE + 1) + 1;
}

function drawLine(x0, y0, x1, y1) {
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
}

function drawHorizontalLines() {
  for (let i = 0; i <= height; i++) {
    const y = lineOffset(i);
    drawLine(0, y, lineOffset(width), y);
  }
}

function drawVerticalLines() {
  for (let j = 0; j <= width; j++) {
    const x = lineOffset(j);
    drawLine(x, 0, x, lineOffset(height));
  }
}

function drawGrid() {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;
  drawHorizontalLines();
  drawVerticalLines();
  ctx.stroke();
}

function drawCells() {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);
  ctx.beginPath();
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const idx = i * width + j;
      ctx.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;
      ctx.fillRect(lineOffset(j), lineOffset(i), CELL_SIZE, CELL_SIZE);
    }
  }
  ctx.stroke();
}

function drawUniverse() {
  drawGrid();
  drawCells();
}

drawUniverse();
requestAnimationFrame(function render() {
  requestAnimationFrame(render);
  universe.tick();
  drawUniverse();
});
