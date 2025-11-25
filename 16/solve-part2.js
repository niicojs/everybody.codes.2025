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

let answer = pattern.reduce((acc, val) => acc * val, 1);

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
