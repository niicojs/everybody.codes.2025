import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, nums, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const raw = getRawData().trim();
let A = nums(raw);
let END = add(A, [1000, 1000]);

function add([X1, Y1], [X2, Y2]) {
  return [X1 + X2, Y1 + Y2];
}

function multiply([X1, Y1], [X2, Y2]) {
  return [X1 * X2 - Y1 * Y2, X1 * Y2 + Y1 * X2];
}

function divide([X1, Y1], [X2, Y2]) {
  return [Math.trunc(X1 / X2), Math.trunc(Y1 / Y2)];
}

function is_engraved([X, Y]) {
  let res = [0, 0];
  for (let i = 0; i < 100; i++) {
    res = multiply(res, res);
    res = divide(res, [100000, 100000]);
    res = add(res, [X, Y]);
    if (res[0] > 1000000 || res[1] > 1000000) return false;
    if (res[0] < -1000000 || res[1] < -1000000) return false;
  }
  return true;
}

const STEP = 1;

const key = ([X, Y]) => `${X},${Y}`;

const dots = new Set();
for (let c = A[0]; c <= END[0]; c += STEP) {
  for (let r = A[1]; r <= END[1]; r += STEP) {
    if (is_engraved([c, r])) {
      dots.add(key([c, r]));
    }
  }
}

// for (let c = A[0]; c <= END[0]; c += STEP) {
//   let line = '';
//   for (let r = A[1]; r <= END[1]; r += STEP) {
//     const dot = is_engraved([c, r]) ? 'x' : '·';
//     line += dot;
//   }
//   consola.log(line);
// }

let answer = dots.size;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
