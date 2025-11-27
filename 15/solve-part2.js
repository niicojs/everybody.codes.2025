import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import { getCurrentDay, getDirectNeighbors, getRawData, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const key = (x, y) => `${x},${y}`;
const input = getRawData().trim().split(',');
const grid = new Map();
let [minx, maxx, miny, maxy] = [0, 0, 0, 0];
let [sx, sy, tx, ty] = [0, 0, 0, 0];

function build_grid() {
  let dir = [0, -1];
  let [x, y] = [sx, sy];
  grid.set(key(x, y), 'S');
  while (input.length > 0) {
    const instr = input.shift();
    const n = +instr.slice(1);
    if (instr[0] === 'L') {
      dir = [dir[1], -dir[0]];
    } else if (instr[0] === 'R') {
      dir = [-dir[1], dir[0]];
    }
    for (let step = 0; step < n; step++) {
      [x, y] = [x + dir[0], y + dir[1]];
      grid.set(key(x, y), '#');
    }
    [minx, maxx] = [Math.min(minx, x), Math.max(maxx, x)];
    [miny, maxy] = [Math.min(miny, y), Math.max(maxy, y)];
  }
  [tx, ty] = [x, y];
  grid.set(key(x, y), 'T');
}

function print_grid() {
  for (let y = miny - 1; y <= maxy + 1; y++) {
    let line = '';
    for (let x = minx - 1; x <= maxx + 1; x++) {
      if (x === sx && y === sy) {
        line += 'S';
      } else {
        line += grid.get(`${x},${y}`) || ' ';
      }
    }
    consola.info(line);
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

    if (x === tx && y === ty) return score;

    if (visited.has(key(x, y))) continue;
    visited.add(key(x, y));

    const possible = getDirectNeighbors(x, y).filter(
      ([nx, ny]) => grid.get(key(nx, ny)) !== '#' && x >= minx - 1 && x <= maxx + 1 && y >= miny - 1 && y <= maxy + 1
    );

    for (const [nx, ny] of possible) {
      todo.push({ pos: [nx, ny], score: score + 1 });
    }
  }

  return 0;
}

build_grid();
print_grid();

let answer = search();

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
