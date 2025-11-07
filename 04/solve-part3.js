import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, nums, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const ROTATIONS = 100;
const numbers = getDataLines().map(nums);

let speed = 1;
let current = numbers.shift()[0];
while (numbers.length) {
  const next = numbers.shift();
  if (next.length === 1) {
    let mul = current / next[0];
    current = next[0];
    speed *= mul;
  } else {
    const [one, two] = next;
    let mul = current / one;
    speed *= mul;

    current = two;
  }
}

let answer = Math.floor(ROTATIONS * speed);

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
