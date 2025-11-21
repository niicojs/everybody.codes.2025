import { consola } from 'consola';
import clipboard from 'clipboardy';
import { diagNeighbors, getCurrentDay, getDataLines, getGrid, inGridRange, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

let grid = getGrid(getDataLines());
const ROUNDS = 2025;

function round(grid) {
  const newGrid = grid.map((row) => row.slice());
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const match = diagNeighbors
        .map(([dx, dy]) => [x + dx, y + dy])
        .filter(([nx, ny]) => inGridRange(grid, nx, ny) && grid[ny][nx] === '#');
      if (grid[y][x] === '#') {
        if (match.length % 2 === 0) {
          newGrid[y][x] = '.';
        } else {
          newGrid[y][x] = '#';
        }
      } else {
        if (match.length % 2 !== 0) {
          newGrid[y][x] = '.';
        } else {
          newGrid[y][x] = '#';
        }
      }
    }
  }
  return newGrid;
}

let answer = 0;
for (let i = 0; i < ROUNDS; i++) {
  grid = round(grid);
  let active = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === '#') active++;
    }
  }
  answer += active;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
