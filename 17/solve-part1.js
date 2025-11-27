import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, getGrid, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const R = 10;
let [sx, sy] = [0, 0];
const grid = getGrid(getDataLines());

// find start
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === '@') [sx, sy] = [x, y];
    else grid[y][x] = +grid[y][x];
  }
}

const isLava = (x, y) => (sx - x) ** 2 + (sy - y) ** 2 <= R * R;

// lava
let answer = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === '@') continue;
    if (isLava(x, y)) answer += grid[y][x];
  }
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
