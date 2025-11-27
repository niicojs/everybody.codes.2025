import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import { directNeighbors, getCurrentDay, getRawData, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const key = (x, y) => `${x},${y}`;

const input = getRawData().trim().split(',');

const walls = [];
let [minx, maxx, miny, maxy] = [0, 0, 0, 0];
let [sx, sy, tx, ty] = [0, 0, 0, 0];

function build_walls() {
  let dir = [0, -1];
  let [x, y] = [sx, sy];

  while (input.length > 0) {
    const instr = input.shift();
    const n = +instr.slice(1);
    if (instr[0] === 'L') {
      dir = [dir[1], -dir[0]];
    } else if (instr[0] === 'R') {
      dir = [-dir[1], dir[0]];
    }

    let [from, to] = [
      [x, y],
      [x + dir[0] * n, y + dir[1] * n],
    ];
    if (from[0] > to[0] || from[1] > to[1]) {
      [from, to] = [to, from];
    }

    walls.push({
      from,
      to,
      dir: dir.slice(),
      orientation: dir[0] === 0 ? 'V' : 'H',
    });
    [x, y] = [x + dir[0] * n, y + dir[1] * n];

    [minx, maxx] = [Math.min(minx, x), Math.max(maxx, x)];
    [miny, maxy] = [Math.min(miny, y), Math.max(maxy, y)];
  }
  [tx, ty] = [x, y];
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

    // right
    const right = walls
      .filter(({ from, to, orientation }) => orientation === 'V' && from[0] === x + 1 && from[1] <= y && to[1] >= y)
      .toSorted((a, b) => a.from[1] - b.from[1]);

    for (const [nx, ny] of possible) {
      todo.push({ pos: [nx, ny], score: score + 1 });
    }
  }

  return 0;
}

build_walls();
let answer = 0; //search();

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
