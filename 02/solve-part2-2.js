import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day);
consola.info(isReal ? 'real' : 'test', 'data');
const t = timer();

const repeat = 100_000;
const balloons = getRawData().trim().repeat(repeat).split('').reverse();

// reverse cause pop is faster than shift

const shots = ['R', 'G', 'B'];

let i = 0;
while (balloons.length > 0) {
  const c = shots[i % shots.length];
  if (c === balloons[balloons.length - 1] && balloons.length % 2 === 0) {
    balloons.splice(balloons.length / 2, 1);
  }
  balloons.pop();
  i++;
}

let answer = i;

// not 2 953 681

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
