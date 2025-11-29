import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import { getCurrentDay, getDataLines, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const grid = getDataLines().map((l) => l.replaceAll('.', '').split(''));

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

consola.info('Start:', [sx, sy], 'End:', [ex, ey]);

function rotate_backward_120d([c, r]) {
  return [r * 2 + (c % 2), grid.length - 1 - Math.floor((c + 1) / 2) - r];
}

function get_neighbors(x, y) {
  const [rx, ry] = rotate_backward_120d([x, y]);

  const result = [];
  result.push([rx, ry]);

  if (rx > 0) result.push([rx - 1, ry]);
  if (rx < grid[ry].length - 1) result.push([rx + 1, ry]);
  if (rx % 2 === 0) {
    if (ry > 0) result.push([rx + 1, ry - 1]);
  } else {
    if (ry < grid.length - 1) result.push([rx - 1, ry + 1]);
  }

  return result.filter(([nx, ny]) => grid[ny][nx] === 'T');
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

    const possible = get_neighbors(x, y);

    for (const [nx, ny] of possible) {
      todo.push({ pos: [nx, ny], score: score + 1 });
    }
  }
}

const answer = search();

if (!isReal && answer !== 23) {
  consola.error('❌ Test failed ! Expected 23 but got', answer);
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
