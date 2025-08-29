import { consola } from 'consola';
import { colors } from 'consola/utils';
import clipboard from 'clipboardy';
import {
  enumGrid,
  getCurrentDay,
  getDirectNeighbors,
  getGrid,
  getRawData,
  inGridRange,
  memoize,
  mod,
  neighbors,
  nums,
  timer,
} from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day);
const t = timer();

const [one, two] = getRawData()
  .trim()
  .split(/\r?\n\r?\n/);

const lines = one.split(/\r?\n/).map((l) => nums(l));
const grid = getGrid(two.split(/\r?\n/));
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    grid[y][x] = +grid[y][x];
  }
}

const rolls = {};
const dices = [];
for (const line of lines) {
  const seed = line.pop();
  const [id, ...faces] = line;
  const dice = {
    id,
    n: 1,
    faces,
    seed,
    pulse: seed,
    last: 0,
  };
  dices.push(dice);
  rolls[id] = [];
}

function roll(dice) {
  const spin = dice.n * dice.pulse;
  const next = (dice.last + spin) % dice.faces.length;
  const res = dice.faces[next];

  dice.pulse += spin;
  dice.pulse = mod(dice.pulse, dice.seed);
  dice.pulse = dice.pulse + 1 + dice.n + dice.seed;

  dice.n++;
  dice.last = next;

  return res;
}

// precompute
for (const dice of dices) {
  rolls[dice.id] = Array(grid.length * grid[0].length);
  for (let i = 0; i < grid.length * grid[0].length; i++) {
    rolls[dice.id][i] = roll(dice);
  }
}

const reached = Array(grid.length)
  .fill(0)
  .map((a) => Array(grid[0].length).fill(0));

const key = (x, y, id, n) => `${x},${y},${id},${n}`;
const printGrid = () => {
  const pad = (grid.length - 1).toString().length;
  console.log(''.padStart(pad, ' ') + ' ┌' + '─'.repeat(grid[0].length) + '┐');
  for (let y = 0; y < grid.length; y++) {
    let line = y.toString().padStart(pad, ' ') + ' │';
    for (let x = 0; x < grid[y].length; x++) {
      if (reached[y][x]) line += colors.white(grid[y][x]);
      else line += colors.blue(grid[y][x]);
    }
    line += '│';
    console.log(line);
  }
  console.log(''.padStart(pad, ' ') + ' └' + '─'.repeat(grid[0].length) + '┘');
};

const done = new Map();
function follow(dice, { x, y }, n) {
  reached[y][x] = 1;
  if (done.has(key(x, y, dice, n))) return;

  const val = rolls[dice][n];
  const ok = getDirectNeighbors(x, y)
    .filter(([a, b]) => inGridRange(grid, a, b))
    .filter(([a, b]) => grid[b][a] === val);

  if (val === grid[y][x]) ok.push([x, y]);
  if (ok.length === 0) return null;

  for (const [a, b] of ok) {
    follow(dice, { x: a, y: b }, n + 1);
  }

  done.set(key(x, y, dice, n));
}

for (const dice of dices) {
  const val = rolls[dice.id][0];
  const possible = Array.from(enumGrid(grid)).filter(
    ({ cell }) => cell === val
  );
  for (const pos of possible) {
    follow(dice.id, pos, 1);
  }
}

printGrid();

let answer = reached.flat().reduce((a, c) => a + c, 0);
consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
