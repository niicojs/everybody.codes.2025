import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, mod, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const REPEAT = isReal ? 1_000 : 1_000;
const FARAWAY = isReal ? 1_000 : 1_000;

const input = getRawData().trim();

let answer = 0;
for (let i = 0; i < input.length * REPEAT; i++) {
  const c = input[mod(i, input.length)];
  if (c < 'a' || c > 'z') continue;

  let m = c.toUpperCase();
  for (let j = -FARAWAY; j <= FARAWAY; j++) {
    if (i + j < 0) continue;
    if (i + j >= input.length * REPEAT) continue;
    if (input[mod(i + j, input.length)] === m) answer++;
  }
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
