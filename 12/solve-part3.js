import { consola } from 'consola';
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

const done = [, new Set(), new Set(), new Set()];

const ignite_zone = memoize((x, y, round) => {
  const val = grid[y][x];
  const to_burn = new TinyQueue([[x, y]]);
  const visited = new Set();
  const todo = new Set();
  // burn all connected of same value
  while (to_burn.length) {
    const [cx, cy] = to_burn.pop();
    if (done[round].has(key(cx, cy))) continue;
    if (visited.has(key(cx, cy))) continue;
    visited.add(key(cx, cy));
    const neighbors = getDirectNeighbors(cx, cy).filter(([nx, ny]) => inGridRange(grid, nx, ny) && grid[ny][nx] >= val);
    for (const [a, b] of neighbors) {
      if (grid[b][a] === val) to_burn.push([a, b]);
      else todo.add(key(a, b));
    }
  }
  // then recurse on neighbors
  for (const pos of todo) {
    const [nx, ny] = pos.split(',').map(Number);
    ignite_zone(nx, ny, round);
  }
});

function ignite(x, y, done) {
  let fires = new Set([key(x, y)]);
  while (true) {
    const new_fires = new Set(fires);
    for (const pos of fires) {
      const [x, y] = pos.split(',').map(Number);
      const possible = getDirectNeighbors(x, y).filter(
        ([nx, ny]) => inGridRange(grid, nx, ny) && !done.has(key(x, y)) && grid[ny][nx] <= grid[y][x]
      );
      for (const [nx, ny] of possible) new_fires.add(key(nx, ny));
    }
    if (new_fires.size === fires.size) break;
    fires = new_fires;
  }
  return fires;
}

function find_best_start(done) {
  let skip = new Set();
  const best = { val: 0, set: null };
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === 1) continue;
      if (skip.has(key(x, y)) || done.has(key(x, y))) continue;
      const fires = ignite(x, y, done);
      if (fires.size > best.val) {
        best.val = fires.size;
        best.set = fires;
      }
      skip = skip.union(fires);
    }
    consola.info('Row', y, 'done. Skipped positions:', skip.size);
  }
  return best;
}



let answer = done.size;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
