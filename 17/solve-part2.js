import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, getGrid, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

let [sx, sy] = [0, 0];
const grid = getGrid(getDataLines());

// find start
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    if (grid[y][x] === '@') [sx, sy] = [x, y];
    else grid[y][x] = +grid[y][x];
  }
}

const isLava = (x, y, R) => (sx - x) ** 2 + (sy - y) ** 2 <= R * R;

// lava

let [max_step, max_r] = [0, 0];
let R = 1;
while (true) {
  let step = 0;
  let stop = false;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === '@') continue;
      if (isLava(x, y, R)) {
        step += grid[y][x];
        grid[y][x] = '@';
        if (y === 0 || y === grid.length - 1 || x === 0 || x === grid[0].length - 1) stop = true;
      }
    }
  }
  if (step >= max_step) {
    max_step = step;
    max_r = R;
  }
  if (stop) break;
  R++;
}

consola.info({ max_r, max_step });
const answer = max_step * max_r;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
