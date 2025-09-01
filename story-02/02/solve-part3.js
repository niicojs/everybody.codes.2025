import { consola } from 'consola';
import clipboard from 'clipboardy';
import { Deque } from '@datastructures-js/deque';
import { getCurrentDay, getRawData, timer } from '../../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const repeat = 100_000;
const input = getRawData().trim().repeat(repeat);
const left = new Deque(input.substring(0, input.length / 2).split(''));
const right = new Deque(input.substring(input.length / 2).split(''));

const shots = ['R', 'G', 'B'];

let i = 0;
while (left.size() > 0 || right.size() > 0) {
  const c = shots[i % shots.length];
  if (c === left.front()) {
    if (left.size() === right.size()) {
      left.popFront();
      right.popFront();
    } else {
      left.popFront();
      if (left.size() < right.size()) {
        left.pushBack(right.popFront());
      }
    }
  } else {
    left.popFront();
    if (left.size() < right.size()) {
      left.pushBack(right.popFront());
    }
  }
  i++;
}

let answer = i;

// not 2 953 681

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
