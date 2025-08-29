import { consola } from 'consola';
import clipboard from 'clipboardy';
import {
  getCurrentDay,
  getRawData,
  mod,
  nums,
  timer,
} from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day);
const t = timer();

const [one, two] = getRawData()
  .trim()
  .split(/\r?\n\r?\n/);

const lines = one.split(/\r?\n/).map((l) => nums(l));
const track = two.split('').map((n) => +n);

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

for (const dice of dices) {
  let turn = 0;
  let pos = 0;
  while (pos !== track.length) {
    turn++;
    const val = roll(dice);
    if (val === track[pos]) pos++;
  }
  dice.turn = turn;
}

dices.sort((a, b) => a.turn - b.turn);

let answer = dices.map((d) => d.id.toString()).join(',');
consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
