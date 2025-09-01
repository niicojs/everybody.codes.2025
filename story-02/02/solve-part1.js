import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day);
const t = timer();

const balloons = getRawData().trim().split('');

const shots = ['R', 'G', 'B'];

const ln = balloons.length;
consola.log(balloons.join(''));

let i = 0;
while (balloons.length > 0) {
  let b = 0;
  while (balloons[b] === shots[i % shots.length] && b < ln) b++;
  balloons.splice(0, b + 1);
  i++;
  // consola.log(balloons.join('').padStart(ln, ' '));
}

let answer = i;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
