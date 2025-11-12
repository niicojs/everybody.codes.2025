import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const [one, two] = getRawData().split(/\r?\n\r?\n/);
const debuts = one.split(',');
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

let names = new Set();
function generate(start) {
  if (names.has(start)) return;
  names.add(start);
  if (start.length >= 11) return;

  const last = start.at(-1);
  if (rules.has(last)) {
    for (const next of rules.get(last)) {
      generate(start + next);
    }
  }
}

for (const debut of debuts) {
  if (!check(debut)) continue;
  generate(debut);
}

let answer = Array.from(names).filter((n) => n.length >= 7).length;
consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
