import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const [one, two] = getRawData().split(/\r?\n\r?\n/);
const names = one.split(',');
const rules = new Map(
  two.split(/\r?\n/).map((l) => {
    const [a, b] = l.split(' > ');
    return [a, b.split(',')];
  })
);

function check(name) {
  for (let i = 0; i < name.length - 1; i++) {
    if (!rules.get(name[i]).includes(name[i + 1])) return false;
  }
  return true;
}

let answer = '';
for (const name of names) {
  if (check(name)) answer = name;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
