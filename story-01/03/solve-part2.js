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
let step = 1;
const lines = getDataLines().map((l) => nums(l));
for (const line of lines) {
  let [x, y] = line;
  [x, y] = pos(x, y, answer);
  const snail = y + x - 1;
  while (y !== 1) {
    answer += step;
    [x, y] = pos(x, y, step);
  }
  step *= snail;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
