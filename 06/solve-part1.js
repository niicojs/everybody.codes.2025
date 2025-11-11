import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const input = getRawData().trim();
let mentors = 0;
let answer = 0;
for (const c of input) {
  if (c !== 'A' && c !== 'a') continue;
  if (c >= 'A' && c <= 'Z') mentors++;
  else if (c >= 'a' && c <= 'z') answer += mentors;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
