import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import { getCurrentDay, getDataLines, getGrid, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const grid = getGrid(getDataLines());

const key = (x, y) => `${x},${y}`;

let [sx, sy] = [0, 0];
let [ex, ey] = [0, 0];

for (let r = 0; r < grid.length; r++) {
  for (let c = 0; c < grid[r].length; c++) {
    if (grid[r][c] === 'S') [sx, sy] = [c, r];
    if (grid[r][c] === 'E') [ex, ey] = [c, r];
    if (['S', 'E'].includes(grid[r][c])) grid[r][c] = 'T';
  }
}

const path = new Map();
function add_path(fromX, fromY, toX, toY) {
  const next = path.get(key(fromX, fromY)) || [];
  next.push([toX, toY]);
  path.set(key(fromX, fromY), next);
}

for (let r = 0; r < grid.length; r++) {
  const first = grid[r].findIndex((c) => c !== '.');
  for (let c = 0; c < grid[r].length; c++) {
    if (c > 0 && grid[r][c] === 'T' && grid[r][c - 1] === 'T') {
      add_path(c, r, c - 1, r);
      add_path(c - 1, r, c, r);
    }
    if (r > 0 && (c - first) % 2 === 0 && grid[r][c] === 'T' && grid[r - 1][c] === 'T') {
      add_path(c, r, c, r - 1);
      add_path(c, r - 1, c, r);
    }
  }
}

function search() {
  const todo = new TinyQueue([{ pos: [sx, sy], score: 0 }], (a, b) => a.score - b.score);
  const visited = new Set();
  while (todo.length > 0) {
    const {
      pos: [x, y],
      score,
    } = todo.pop();

    if (x === ex && y === ey) return score;

    if (visited.has(key(x, y))) continue;
    visited.add(key(x, y));

    const possible = path.get(key(x, y)) || [];

    for (const [nx, ny] of possible) {
      todo.push({ pos: [nx, ny], score: score + 1 });
    }
  }
}

const answer = search();

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
