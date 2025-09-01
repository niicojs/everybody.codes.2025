import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, nums, timer } from '../../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

function pos(x, y, t) {
  const snail = y + x - 1;
  t = t % snail;
  for (let i = 0; i < t; i++) {
    y--;
    if (y === 0) {
      y = x;
      x = 1;
    } else {
      x++;
    }
  }
  return [x, y];
}

let answer = 0;

const lines = getDataLines().map((l) => nums(l));
for (const line of lines) {
  const [x, y] = line;
  const [a, b] = pos(x, y, 100);
  answer += a + 100 * b;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
