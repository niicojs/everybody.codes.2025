import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, nums, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const NB_NAILS = isReal ? 32 : 8;
const MIDDLE = NB_NAILS / 2;
const values = nums(getRawData().trim());

let answer = 0;
for (let i = 1; i < values.length; i++) {
  if (Math.abs(values[i] - values[i - 1]) === MIDDLE) answer++;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
