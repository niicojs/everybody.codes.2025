import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import {
  getCurrentDay,
  getDataLines,
  getDirectNeighbors,
  getGrid,
  getRawData,
  inGridRange,
  nums,
  sum,
  timer,
} from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const numbers = getDataLines().map((l) => +l);
const TARGET = sum(numbers) / numbers.length;

const checksum = (arr) => arr.reduce((acc, v, i) => acc + v * (i + 1), 0);

let round = 0;

// phase 1
while (true) {
  let has_moved = false;
  for (let i = 0; i < numbers.length - 1; i++) {
    const next = (i + 1) % numbers.length;
    if (numbers[next] < numbers[i]) {
      numbers[i]--;
      numbers[next]++;
      has_moved = true;
    }
  }
  if (!has_moved) break;
  round++;
}
// phase 2
while (true) {
  let has_moved = false;
  for (let i = 0; i < numbers.length - 1; i++) {
    const next = (i + 1) % numbers.length;
    if (numbers[next] > numbers[i]) {
      numbers[i]++;
      numbers[next]--;
      has_moved = true;
    }
  }
  if (!has_moved) break;
  round++;
  if (round === 10) break;
}

// consola.info(numbers.join(','));

let answer = checksum(numbers);

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
