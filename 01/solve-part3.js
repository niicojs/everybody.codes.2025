import { consola } from 'consola';
import clipboard from 'clipboardy';
import {
  getCurrentDay,
  getGrid,
  getRawData,
  permutations,
  printGrid,
  timer,
} from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day);
const t = timer();

const raw = getRawData().trim();
const [one, two] = getRawData()
  .trim()
  .split(/\r?\n\r?\n/);

const nails = getGrid(one.split(/\r?\n/));
const instructions = two.split(/\r?\n/);

printGrid(nails);

function fall(x, y, instr) {
  while (y < nails.length) {
    // printGrid(nails, [[x, y]]);
    if (nails[y][x] === '*') {
      const lr = instr.shift();
      if (lr === 'L') x--;
      else x++;
      // bounce on walls
      if (x < 0) x = 1;
      if (x >= nails[0].length) x = nails[0].length - 2;
    }
    y++;
  }
  return x;
}

// get all possibles values
const toss = Array(instructions.length).fill(null);
for (let ii = 0; ii < instructions.length; ii++) {
  const lr = instructions[ii];
  toss[ii] = [];
  for (let i = 1; i < nails[0].length / 2 + 1; i++) {
    const x = (i - 1) * 2;
    const rx = fall(x, 0, lr.split(''));
    const slot = rx / 2 + 1;
    const val = Math.max(slot * 2 - i, 0);
    toss[ii].push(val);
  }
}

// find worst and best case
function findMinMax(done = []) {
  if (done.length === instructions.length) return [0, 0];
  let [min, max] = [Infinity, -Infinity];
  for (let i = 1; i < nails[0].length / 2 + 1; i++) {
    if (done.includes(i)) continue;
    const val = toss[done.length][i - 1];
    const [newMin, newMax] = findMinMax([...done, i]);
    min = Math.min(min, val + newMin);
    max = Math.max(max, val + newMax);
  }
  return [min, max];
}

const [min, max] = findMinMax();
const answer = `${min} ${max}`;
consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
