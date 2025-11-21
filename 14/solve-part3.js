import { consola } from 'consola';
import clipboard from 'clipboardy';
import { diagNeighbors, getCurrentDay, getDataLines, getGrid, inGridRange, newGrid, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

let target = getGrid(getDataLines());
const SIZE = 34;

function match_pattern(grid) {
  let middle = SIZE / 2;
  let decalage = middle - target.length / 2;
  for (let y = decalage; y < decalage + target.length; y++) {
    for (let x = decalage; x < decalage + target[0].length; x++) {
      const ty = y - decalage;
      const tx = x - decalage;
      if (grid[y][x] !== target[ty][tx]) return false;
    }
  }
  return true;
}

function actives(grid) {
  let active = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === '#') active++;
    }
  }
  return active;
}

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

function hash(grid) {
  return grid.map((row) => row.join('')).join('\n');
}

let grid = newGrid(SIZE, SIZE, '.');

let [answer, idx] = [0, 0];
const cache = new Map();

while (true) {
  idx++;
  grid = round(grid);
  if (match_pattern(grid)) {
    const h = hash(grid);
    const active_count = actives(grid);
    answer += active_count;
    if (cache.has(h)) {
      const [old_idx, old_answer] = cache.get(h);
      let [loop, loop_val] = [idx - old_idx, answer - old_answer];
      let remaining = 1000000000 - idx;
      let loops = Math.floor(remaining / loop);
      answer += loops * loop_val;

      let last = remaining % loop;
      for (let i = 0; i < last; i++) {
        grid = round(grid);
        if (match_pattern(grid)) {
          answer += actives(grid);
        }
      }
      break;
    }
    cache.set(h, [idx, answer]);
  }
}

if (!isReal) consola.info('check:', answer === 278388552 ? '✅ correct' : '❌ incorrect');

if ([1204390068, 1204395000].includes(answer)) {
  consola.error('❌ incorrect');
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
