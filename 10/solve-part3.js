import { consola } from 'consola';
import clipboard from 'clipboardy';
import { enumGrid, getCurrentDay, getDataLines, getGrid, inGridRange, memoize, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

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

let init_sheeps = [];
let init_dragon = [0, 0];
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === 'S') {
    init_sheeps.push([x, y]);
  } else if (cell === 'D') {
    init_dragon = [x, y];
  }
}
const MAX_Y = grid.length;

const nb_moves = memoize(([x, y], sheeps, turn) => {
  if (sheeps.length === 0) return 1;

  let possible = 0;
  if (turn === 'sheep') {
    let nb = 0;
    for (const [sx, sy] of sheeps) {
      if (sx === x && sy + 1 === y && grid[y][x] !== '#') continue; // dragon blocks
      nb++;
      if (sy === MAX_Y) continue; // get out
      possible += nb_moves(
        [x, y],
        sheeps.map(([ox, oy]) => (ox === sx && oy === sy ? [sx, sy + 1] : [ox, oy])),
        'dragon'
      );
    }
    if (nb === 0) possible += nb_moves([x, y], sheeps, 'dragon');
  } else if (turn === 'dragon') {
    const moves = knight_moves.map(([dx, dy]) => [x + dx, y + dy]).filter(([nx, ny]) => inGridRange(grid, nx, ny));
    for (const [nx, ny] of moves) {
      if (grid[ny][nx] === '#') {
        possible += nb_moves([nx, ny], sheeps, 'sheep');
      } else {
        if (sheeps.some(([sx, sy]) => sx === nx && sy === ny)) {
          const new_sheeps = sheeps.filter(([sx, sy]) => !(sx === nx && sy === ny));
          possible += nb_moves([nx, ny], new_sheeps, 'sheep');
        } else {
          possible += nb_moves([nx, ny], sheeps, 'sheep');
        }
      }
    }
  }
  return possible;
});

let answer = nb_moves(init_dragon, init_sheeps, 'sheep');

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
