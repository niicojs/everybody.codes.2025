import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, sum, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

let numbers = getDataLines().map((l) => +l);
const TARGET = sum(numbers) / numbers.length;

// numbers are already sorted so part 1 does not append.
// each round, only one number below average is increasing by 1
// so answer is sum of (TARGET - n) for each n < TARGET

const answer = numbers
  .filter((n) => n < TARGET)
  .map((n) => TARGET - n)
  .reduce((acc, v) => acc + v, 0);

consola.success('result', answer, answer === 1378 ? '✅' : '❌');
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
