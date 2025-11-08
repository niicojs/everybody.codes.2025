import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, mod, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const [one, two] = getRawData()
  .trim()
  .split(/\r?\n\r?\n/);

const names = one.split(',');
const operations = two.split(',').map((o) => [o.slice(0, 1), +o.slice(1)]);

let pos = 0;
while (operations.length > 0) {
  const [dir, dist] = operations.shift();
  let dest = 0;
  if (dir === 'R') {
    dest = mod(pos + dist, names.length);
  } else if (dir === 'L') {
    dest = mod(pos - dist, names.length);
  }
  const tmp = names[dest];
  names[dest] = names[pos];
  names[pos] = tmp;
}

let answer = names[pos];

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
