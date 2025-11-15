import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import { enumGrid, getCurrentDay, getDataLines, getGrid, inGridRange, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const RANGE = 4;
const grid = getGrid(getDataLines());
const knight_moves = [
  [1, 2],
  [2, 1],
  [-1, 2],
  [-2, 1],
  [1, -2],
  [2, -1],
  [-1, -2],
  [-2, -1],
];

const key = (x, y, x2, y2) => {
  if (x2 && y2) return `${x},${y},${x2},${y2}`;
  else return `${x},${y}`;
};

function search() {
  let pos = [0, 0];
  for (const { x, y } of enumGrid(grid)) {
    if (grid[y][x] === 'D') pos = [x, y];
  }
  const todo = new TinyQueue([{ pos, left: RANGE }], (a, b) => a.score - b.score);
  const sheep = new Set();
  while (todo.length > 0) {
    const {
      pos: [x, y],
      left,
    } = todo.pop();

    if (grid[y][x] === 'S') sheep.add(key(x, y));
    if (left === 0) continue;

    const possible = knight_moves.map(([dx, dy]) => [x + dx, y + dy]).filter(([nx, ny]) => inGridRange(grid, nx, ny));

    for (const [nx, ny] of possible) {
      todo.push({ pos: [nx, ny], left: left - 1 });
    }
  }

  return sheep.size;
}

let answer = search();

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
