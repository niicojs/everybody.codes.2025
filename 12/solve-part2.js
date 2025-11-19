import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, getDirectNeighbors, getGrid, inGridRange, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const grid = getGrid(getDataLines());

const key = (x, y) => `${x},${y}`;
let fires = new Set([key(0, 0), key(grid[0].length - 1, grid.length - 1)]);

while (true) {
  const new_fires = new Set(fires);
  for (const pos of fires) {
    const [x, y] = pos.split(',').map(Number);
    const possible = getDirectNeighbors(x, y).filter(
      ([nx, ny]) => inGridRange(grid, nx, ny) && grid[ny][nx] <= grid[y][x]
    );
    for (const [nx, ny] of possible) new_fires.add(key(nx, ny));
  }
  if (new_fires.size === fires.size) break;
  fires = new_fires;
}

let answer = fires.size;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
