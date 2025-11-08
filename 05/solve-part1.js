import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const [, two] = getRawData().trim().split(':');
const list = two.split(',').map(Number);
const first = list.shift();

const fishbone = [{ v: first, left: null, right: null }];
function construct(n) {
  let idx = 0;
  while (idx < fishbone.length) {
    const node = fishbone[idx];
    if (n < node.v && node.left === null) {
      node.left = n;
      break;
    } else if (n > node.v && node.right === null) {
      node.right = n;
      break;
    } else {
      idx++;
    }
  }
  if (idx === fishbone.length) {
    fishbone.push({ v: n, left: null, right: null });
  }
}

while (list.length) {
  const n = list.shift();
  construct(n);
}

let answer = fishbone.map((n) => n.v.toString()).join('');

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
