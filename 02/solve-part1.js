import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, nums, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const raw = getRawData().trim();
let A = nums(raw);

function add([X1, Y1], [X2, Y2]) {
  return [X1 + X2, Y1 + Y2];
}

function multiply([X1, Y1], [X2, Y2]) {
  return [X1 * X2 - Y1 * Y2, X1 * Y2 + Y1 * X2];
}

function divide([X1, Y1], [X2, Y2]) {
  return [Math.floor(X1 / X2), Math.floor(Y1 / Y2)];
}

let res = [0, 0];
for (let i = 0; i < 3; i++) {
  res = multiply(res, res);
  res = divide(res, [10, 10]);
  res = add(res, A);
}

let answer = `[${res[0]},${res[1]}]`;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
