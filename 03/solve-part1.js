import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, mod, nums, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day);
const t = timer();

const lines = getDataLines().map((l) => nums(l));

const dices = [];
for (const line of lines) {
  const seed = line.pop();
  const [id, ...faces] = line;
  const dice = {
    id,
    n: 1,
    faces,
    seed,
    pulse: seed,
    last: 0,
  };
  dices.push(dice);
}

function roll(dice) {
  const spin = dice.n * dice.pulse;
  const next = (dice.last + spin) % dice.faces.length;
  const res = dice.faces[next];

  dice.pulse += spin;
  dice.pulse = mod(dice.pulse, dice.seed);
  dice.pulse = dice.pulse + 1 + dice.n + dice.seed;

  dice.n++;
  dice.last = next;

  return res;
}

let answer = 0;
let target = 10_000;

while (true) {
  answer++;
  for (const dice of dices) {
    target -= roll(dice);
  }
  if (target <= 0) break;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
