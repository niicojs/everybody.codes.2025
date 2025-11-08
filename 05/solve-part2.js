import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const lines = getDataLines().map((l) => {
  const [one, two] = l.split(':');
  return [+one, two.split(',').map(Number)];
});

function quality([, list]) {
  const first = list.shift();
  const fishbone = [{ v: first, left: null, right: null }];
  while (list.length) {
    const n = list.shift();
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

  return +fishbone.map((n) => n.v.toString()).join('');
}

const qualities = lines.map((s) => quality(s));
const min = Math.min(...qualities);
const max = Math.max(...qualities);

let answer = max - min;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
