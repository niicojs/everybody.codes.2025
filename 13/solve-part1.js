import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const numbers = getDataLines().map((l) => +l);

let wheel = Array.from({ length: numbers.length + 2 });

const start = Math.ceil(wheel.length / 2);
let [next, left, right] = ['right', start - 1, start + 1];

wheel[start] = 1;
while (numbers.length) {
  const num = numbers.shift();
  if (next === 'right') {
    wheel[right] = num;
    right++;
    next = 'left';
  } else {
    wheel[left] = num;
    left--;
    next = 'right';
  }
}

wheel = wheel.slice(start, right).concat(wheel.slice(left + 1, start));

let answer = wheel[2025 % wheel.length];

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
