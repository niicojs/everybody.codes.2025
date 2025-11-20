import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const numbers = getDataLines().map((l) => l.split('-').map((c) => +c));
const total = numbers.reduce((acc, [a, b]) => acc + b - a + 1, 0);
consola.info('Total numbers:', total);

let wheel = Array.from({ length: 2 * total });

const start = Math.ceil(wheel.length / 2);
let [next, left, right] = ['right', start - 1, start + 1];

wheel[start] = 1;
while (numbers.length) {
  const [a, b] = numbers.shift();
  if (next === 'right') {
    for (let x = a; x <= b; x++) wheel[right++] = x;
    next = 'left';
  } else {
    for (let x = a; x <= b; x++) wheel[left--] = x;
    next = 'right';
  }
}

wheel = wheel.slice(start, right).concat(wheel.slice(left + 1, start));

let answer = wheel[20252025 % wheel.length];

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
