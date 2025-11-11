import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, mod, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const REPEAT = isReal ? 1_000 : 2;
const FARAWAY = isReal ? 1_000 : 10;

const input = getRawData().trim();

// first
let first = 0;
for (let i = 0; i < input.length; i++) {
  const c = input[i];
  if (c < 'a' || c > 'z') continue;

  let m = c.toUpperCase();
  for (let j = -FARAWAY; j <= FARAWAY; j++) {
    if (i + j < 0) continue;
    if (input[mod(i + j, input.length)] === m) first++;
  }
}

// last
let last = 0;
for (let i = 0; i < input.length; i++) {
  const c = input[i];
  if (c < 'a' || c > 'z') continue;

  let m = c.toUpperCase();
  for (let j = -FARAWAY; j <= FARAWAY; j++) {
    if (i + j >= input.length) continue;
    if (input[mod(i + j, input.length)] === m) last++;
  }
}

// middle
let middle = 0;
for (let i = 0; i < input.length; i++) {
  const c = input[i];
  if (c < 'a' || c > 'z') continue;

  let [m, match] = [c.toUpperCase(), 0];
  for (let j = -FARAWAY; j <= FARAWAY; j++) {
    if (input[mod(i + j, input.length)] === m) match++;
  }

  middle += match;
}

let answer = first + last + (REPEAT - 2) * middle;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
