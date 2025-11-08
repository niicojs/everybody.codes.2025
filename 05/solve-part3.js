import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

function build(sword) {
  const list = sword.list.slice();
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

  sword.fishbone = fishbone;
  sword.quality = +fishbone.map((n) => n.v.toString()).join('');
  sword.levels = fishbone.map((n) => +((n.left || '') + n.v.toString() + (n.right || '')));
}

const swords = getDataLines().map((l) => {
  const [one, two] = l.split(':');
  const sword = { id: +one, list: two.split(',').map(Number) };
  build(sword);
  return sword;
});

function compare_words(a, b) {
  if (a.quality < b.quality) return 1;
  if (a.quality > b.quality) return -1;
  for (let i = 0; i < a.levels.length; i++) {
    if (a.levels[i] < b.levels[i]) return 1;
    if (a.levels[i] > b.levels[i]) return -1;
  }
  if (a.id < b.id) return 1;
  if (a.id > b.id) return -1;
  return 0;
}

swords.sort(compare_words);

let answer = 0;
for (let i = 0; i < swords.length; i++) {
  answer += (i + 1) * swords[i].id;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
