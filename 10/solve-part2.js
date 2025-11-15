import { consola } from 'consola';
import clipboard from 'clipboardy';
import { enumGrid, getCurrentDay, getDataLines, getGrid, inGridRange, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const key = (x, y) => `${x},${y}`;

const TIME = isReal ? 20 : 3;
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

let sheeps = [];
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === 'S') {
    sheeps.push({ init: [x, y], pos: (t) => [x, y + t] });
  }
}
const total_sheeps = sheeps.length;

let dragon = [0, 0];
for (const { x, y } of enumGrid(grid)) {
  if (grid[y][x] === 'D') dragon = [x, y];
}

function get_next_positions(positions) {
  const next = new Set();
  for (const [x, y] of Array.from(positions).map((p) => p.split(',').map(Number))) {
    knight_moves
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(([nx, ny]) => inGridRange(grid, nx, ny))
      .forEach(([nx, ny]) => next.add(key(nx, ny)));
  }
  return next;
}

let time = 0;
let possible = new Set([key(...dragon)]);
while (time < TIME) {
  possible = get_next_positions(possible);
  const next_sheep = [];
  for (const s of sheeps) {
    let safe = true;
    for (const [x, y] of [s.pos(time), s.pos(time + 1)]) {
      if (possible.has(key(x, y)) && grid[y][x] !== '#') {
        safe = false;
      }
    }
    if (safe) next_sheep.push(s);
  }
  sheeps = next_sheep;
  time++;
}

let answer = total_sheeps - sheeps.length;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
