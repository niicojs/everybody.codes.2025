import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const numbers = getDataLines().map((l) => l.split('-').map((c) => +c));

let wheel = [{ from: 1, to: 1, ln: 1, dir: 1 }];
let [i, total] = [0, 1];
while (i < numbers.length) {
  const [a, b] = numbers[i];
  wheel.push({ from: a, to: b, ln: b - a + 1, dir: 1 });
  i += 2;
  total += b - a + 1;
}
i -= 1;
if (i > numbers.length - 1) i -= 2;
while (i > 0) {
  const [a, b] = numbers[i];
  wheel.push({ from: b, to: a, ln: b - a + 1, dir: -1 });
  i -= 2;
  total += b - a + 1;
}

let target = 202520252025 % total;

i = 0;
let w = 0;
while (i <= target) {
  i += wheel[w].ln;
  w++;
}
w--;
i -= wheel[w].ln;

let answer = wheel[w].from;
while (i < target) {
  i++;
  answer += wheel[w].dir;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
