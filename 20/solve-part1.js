import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, getGrid, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const grid = getGrid(getDataLines());

let answer = 0;
for (let r = 0; r < grid.length; r++) {
  const first = grid[r].findIndex((c) => c !== '.');
  for (let c = 0; c < grid[r].length; c++) {
    if (c > 0 && grid[r][c] === 'T' && grid[r][c - 1] === 'T') answer++;
    if (r > 0 && (c - first) % 2 === 0) {
      if (grid[r][c] === 'T' && grid[r - 1][c] === 'T') answer++;
    }
  }
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
