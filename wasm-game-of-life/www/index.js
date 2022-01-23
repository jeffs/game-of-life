import { Universe } from "wasm-game-of-life";

const pre = document.querySelector("#game-of-life-canvas");
const universe = Universe.new();

function renderLoop() {
  requestAnimationFrame(renderLoop);
  pre.textContent = universe.render();
  universe.tick();
}

requestAnimationFrame(renderLoop);
