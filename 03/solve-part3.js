import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, nums, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

let creates = nums(getRawData().trim());

let answer = 0;
while (creates.length > 0) {
  const set = new Set(creates);

  for (const n of set) {
    const idx = creates.indexOf(n);
    creates.splice(idx, 1);
  }

  answer++;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
