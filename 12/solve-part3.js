import { consola } from 'consola';
import { colors } from 'consola/utils';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import { getCurrentDay, getDataLines, getDirectNeighbors, getGrid, inGridRange, memoize, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const grid = getGrid(getDataLines());
consola.info('Grid size', grid[0].length + 'x' + grid.length);

const key = (x, y) => `${x},${y}`;

const done = [new Set(), new Set(), new Set(), new Set()];

const ignite_zone = memoize((x, y, round) => {
  const val = grid[y][x];
  const to_burn = new TinyQueue([[x, y]]);
  let visited = new Set().union(done[round - 1]);
  const todo = new Set();
  // burn all connected of same value
  while (to_burn.length) {
    const [cx, cy] = to_burn.pop();
    if (visited.has(key(cx, cy))) continue;
    visited.add(key(cx, cy));
    const neighbors = getDirectNeighbors(cx, cy).filter(([nx, ny]) => inGridRange(grid, nx, ny) && grid[ny][nx] <= val);
    for (const [a, b] of neighbors) {
      if (grid[b][a] === val) to_burn.push([a, b]);
      else todo.add(key(a, b));
    }
  }
  // then recurse on neighbors
  for (const pos of todo) {
    const [nx, ny] = pos.split(',').map(Number);
    const v = ignite_zone(nx, ny, round);
    visited = visited.union(v);
  }

  return visited;
});

function find_best_start(round) {
  let skip = new Set().union(done[round - 1]);
  const best = { val: 0, set: null };
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === 1) continue;
      if (skip.has(key(x, y))) continue;
      // if (best.set?.has(key(x, y))) continue;
      const fires = ignite_zone(x, y, round);
      skip = skip.union(fires);
      if (fires.size > best.val) {
        best.val = fires.size;
        best.set = fires;
      }
    }
    consola.info(`Round ${round} progress: ${(((y + 1) / grid.length) * 100).toFixed(2)}%`);
  }
  return best;
}

for (let round = 1; round <= 3; round++) {
  consola.info(`Starting round ${round}`);
  const best = find_best_start(round);
  done[round] = best.set;
}

function print_round(round) {
  consola.info('─'.repeat(grid[0].length));
  for (let y = 0; y < grid.length; y++) {
    let line = '';
    for (let x = 0; x < grid[0].length; x++) {
      if (done[round].has(key(x, y))) {
        line += colors.red(grid[y][x].toString());
      } else {
        line += grid[y][x].toString();
      }
    }
    consola.info(line);
  }
}


print_round(3);

let answer = done[3].size;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
