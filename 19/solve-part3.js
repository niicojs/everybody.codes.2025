import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import { getCurrentDay, getDataLines, nums, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const opens = getDataLines().map(nums);
opens.sort((a, b) => a[0] - b[0]);

const maxx = opens[opens.length - 1][0];

function search() {
  const todo = new TinyQueue([{ pos: [0, 0], score: 0 }], (a, b) => a.score - b.score);
  while (todo.length > 0) {
    const { pos, score } = todo.pop();
    const [x, y] = pos;

    if (x === maxx) return score;

    const devant = opens.filter(([wx]) => wx > x);
    const new_walls = devant.filter(([wx]) => wx === devant[0][0]);

    for (const wall of new_walls) {
      const [wx, wy, wsize] = wall;
      for (let ty = wy; ty < wy + wsize; ty++) {
        const [dx, dy] = [wx - x, ty - y];
        if (Math.abs(dy) > dx) continue;

        let flaps = 0;
        if (dy >= 0) {
          if ((dx - dy) % 2 !== 0) continue;
          flaps = dy + (dx - dy) / 2;
        } else if (dy < 0) {
          if ((dx + dy) % 2 !== 0) continue;
          flaps = (dy + dx) / 2;
        }
        todo.push({ pos: [wx, ty], score: score + flaps });
      }
    }
  }
}

let answer = search();

if (!isReal) consola.info(answer === 22 ? '✅ test passed' : '❌ test failed');
consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
