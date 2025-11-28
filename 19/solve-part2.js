import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import { getCurrentDay, getDataLines, inGridRange, newGrid, nums, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const lines = getDataLines().map(nums);

const maxx = lines.at(-1)[0];
const maxy = Math.max(...lines.map((l) => l[1] + l[2])) + 5;
const grid = newGrid(maxy, maxx + 1, '.');

for (const x of new Set(lines.map((l) => l[0]))) {
  for (let wy = 0; wy < maxy; wy++) grid[wy][x] = '#';
}

for (const [x, y, size] of lines) {
  for (let wy = 0; wy < maxy; wy++) {
    if (wy >= y && wy < y + size) grid[wy][x] = '.';
  }
}

function print_grid(grid) {
  for (let y = grid.length - 1; y >= 0; y--) {
    let line = y.toString().padStart(3) + ' ';
    for (let x = 0; x < grid[0].length; x++) {
      line += grid[y][x];
    }
    console.info(line);
  }
}

print_grid(grid);

const key = (x, y) => `${x},${y}`;

function search() {
  const todo = new TinyQueue([{ pos: [0, 0], score: 0 }], (a, b) => a.score - b.score);
  const visited = new Set();
  while (todo.length > 0) {
    const {
      pos: [x, y],
      score,
    } = todo.pop();

    if (x === maxx) return score;

    if (visited.has(key(x, y))) continue;
    visited.add(key(x, y));

    const possible = [
      [x + 1, y + 1, score + 1],
      [x + 1, y - 1, score],
    ];

    for (const [nx, ny, s] of possible) {
      if (!inGridRange(grid, nx, ny) || grid[ny][nx] !== '.') continue;
      todo.push({ pos: [nx, ny], score: s });
    }
  }
}

let answer = search();

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
