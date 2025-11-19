import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import { getCurrentDay, getDataLines, getDirectNeighbors, getGrid, inGridRange, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const grid = getGrid(getDataLines());

const key = (x, y) => `${x},${y}`;

function ignite(x, y, done) {
  const fires = new Set([key(x, y)]);
  while (true) {
    const new_fires = new Set(fires);
    for (const pos of fires) {
      const [x, y] = pos.split(',').map(Number);
      const possible = getDirectNeighbors(x, y).filter(
        ([nx, ny]) => inGridRange(grid, nx, ny) && !done.get(key(x, y)) && grid[ny][nx] <= grid[y][x]
      );
      for (const [nx, ny] of possible) new_fires.add(key(nx, ny));
    }
    if (new_fires.size === fires.size) break;
    fires = new_fires;
  }
  return fires;
}

function find_best_start() {
}

let answer = fires.size;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
