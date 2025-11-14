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

const nodes = [];
for (let i = 1; i < values.length; i++) {
  const path = [values[i], values[i - 1]].toSorted((a, b) => a - b);
  nodes.push(path);
}

let [max, path] = [0, []];

for (let i = 1; i <= NB_NAILS; i++) {
  for (let j = i + 1; j <= NB_NAILS; j++) {
    let cuts = 0;
    for (const [a, b] of nodes) {
      if (croise([i, j], [a, b])) cuts++;
      else if (a === i && b === j) cuts++;
    }
    if (cuts > max) {
      max = cuts;
      path = [i, j];
    }
  }
}

consola.log({ max, path });
let answer = max;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
