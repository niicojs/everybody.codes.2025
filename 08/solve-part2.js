import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, nums, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const NB_NAILS = isReal ? 256 : 8;
const values = nums(getRawData().trim());

function croise([a, b], [c, d]) {
  const [left, right] = [[], [a]];
  for (let i = a; i <= b; i++) left.push(i);
  for (let i = b; i != a; i = i + 1 > NB_NAILS ? 1 : i + 1) right.push(i);
  if (left.includes(c) && left.includes(d)) return false;
  if (right.includes(c) && right.includes(d)) return false;
  return true;
}

let answer = 0;
const nodes = [];
for (let i = 1; i < values.length; i++) {
  const path = [values[i], values[i - 1]].toSorted((a, b) => a - b);
  for (const [a, b] of nodes) {
    if (croise(path, [a, b])) answer++;
  }

  nodes.push(path);
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
