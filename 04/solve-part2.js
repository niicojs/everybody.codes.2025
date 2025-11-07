import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const ROTATIONS = 10000000000000;
const numbers = getDataLines().map((l) => +l);

let speed = 1;
let current = numbers.shift();
while (numbers.length) {
  const next = numbers.shift();
  let mul = current / next;
  current = next;
  speed *= mul;
}

let answer = Math.ceil(ROTATIONS / speed);

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
