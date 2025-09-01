import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, nums, timer, sum } from '../../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const lines = getDataLines().map((l) => nums(l));

function eni(n, exp, mod) {
  let last = [];
  let x = 1;
  for (let i = 0; i < exp; i++) {
    x = (x * n) % mod;
    let test = last.findIndex((v) => x === v);
    if (test >= 0) {
      const loop = i - test;
      let need = (exp - i) % loop;
      let times = Math.floor((exp - i) / loop);
      const long = sum(last.slice(test)) * times;
      const remains = sum(last.slice(test, test + need));
      last.push(long, remains);
      return sum(last);
    }
    last.push(x);
  }
  throw new Error('oups');
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
