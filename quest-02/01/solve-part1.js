import { consola } from 'consola';
import clipboard from 'clipboardy';
import {
  getCurrentDay,
  getGrid,
  getRawData,
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

let answer = 0;
for (let i = 1; i < nails[0].length / 2 + 1; i++) {
  const x = (i - 1) * 2;
  if (nails[0][x] !== '*') throw new Error('Invalid start');
  const lr = instructions.shift();
  const rx = fall(x, 0, lr.split(''));
  const slot = rx / 2 + 1;
  const val = slot * 2 - i;
  answer += Math.max(0, val);
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
