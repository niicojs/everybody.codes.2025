import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const values = getRawData().trim().split(',').map(Number);

let pattern = [];

let working = values.slice();
while (true) {
  const idx = working.findIndex((v) => v > 0) + 1;
  pattern.push(idx);
  working = working.map((_, i) => ((i + 1) % idx === 0 ? working[i] - 1 : working[i]));
  if (working.every((v) => v <= 0)) break;
}

const MAX_BLOCKS = 202520252025000;
let [low, high] = [0, MAX_BLOCKS];
while (low < high) {
  const mid = Math.floor((low + high) / 2);
  const val = pattern.reduce((acc, v) => acc + Math.floor(mid / v), 0);
  if (val > MAX_BLOCKS) {
    high = mid - 1;
  } else if (val < MAX_BLOCKS) {
    low = mid + 1;
  } else {
    break;
  }
}

let answer = high;
consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
