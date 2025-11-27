import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, getGrid, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

let [sx, sy] = [0, 0];
let [vx, vy] = [0, 0];
const grid = getGrid(getDataLines());

// find start
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    if (grid[y][x] === '@') [vx, vy] = [x, y];
    if (grid[y][x] === 'S') [sx, sy] = [x, y];
    else grid[y][x] = +grid[y][x];
  }
}

const isLava = (x, y, R) => (vx - x) ** 2 + (vy - y) ** 2 <= R * R;
const key = (x, y) => `${x},${y}`;

function on_a_fait_le_tour(path) {

}

function encerclement(max_time) {
  const todo = new TinyQueue([{ pos: [sx, sy], path: [], score: 0 }], (a, b) => a.score - b.score);
  const visited = new Set();
  while (todo.length > 0) {
    const {
      pos: [x, y],
      path,
      score,
    } = todo.pop();

    const new_path = [...path, [x, y]];
    if(on_a_fait_le_tour(new_path)) return true;

    if (visited.has(key(x, y))) continue;
    visited.add(key(x, y));

    const possible = getDirectNeighbors(x, y).filter(([nx, ny]) => inGridRange(grid, nx, ny) && grid[ny][nx] !== '@');

    for (const [nx, ny] of possible) {
      if (score + grid[ny][nx] > max_time) continue;
      todo.push({ pos: [nx, ny], score: score + grid[ny][nx] });
    }
  }
}

let [max_step, max_r] = [0, 0];
let R = 1;
while (true) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === '@') continue;
      if (isLava(x, y, R)) grid[y][x] = '@';
    }
  }
  if (encerclement(R * 30)) break;
  R++;
}

consola.info({ max_r, max_step });
const answer = max_step * max_r;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
