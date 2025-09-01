import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, nums, timer } from '../../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const lines = getDataLines().map((l) => nums(l));

function eni(n, exp, mod) {
  let res = '';
  let x = 1;
  for (let i = 0; i < exp; i++) {
    x = (x * n) % mod;
    res = x.toString() + res;
  }
  return +res;
}

let answer = 0;
for (const line of lines) {
  const [A, B, C, X, Y, Z, M] = line;
  const res = eni(A, X, M) + eni(B, Y, M) + eni(C, Z, M);
  answer = Math.max(answer, res);
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
