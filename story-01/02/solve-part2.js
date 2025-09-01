import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

let maxdeep = 0;
const trees = {};
const nodes = {};
function build(node, id, rank, value, deep = 1) {
  maxdeep = Math.max(deep, maxdeep);
  if (!node.value) {
    node.id = id;
    node.rank = rank;
    node.value = value;
    node.left = {};
    node.right = {};
    if (!nodes[id]) nodes[id] = [node];
    else nodes[id].push(node);
    return;
  }

  if (rank > node.rank) {
    build(node.right, id, rank, value, deep + 1);
  } else {
    build(node.left, id, rank, value, deep + 1);
  }
}

const lines = getDataLines();
for (const line of lines) {
  if (line.startsWith('SWAP ')) {
    const id = line.slice(5);
    const [one, two] = nodes[id];

    let [rank, value] = [one.rank, one.value];
    [one.rank, one.value] = [two.rank, two.value];
    [two.rank, two.value] = [rank, value];
  } else {
    const [, action, id, a1, r1, l1, a2, r2, l2] = line.match(
      /(\w+) id=(\d+) (\w+)=\[(\d+)\,(.+)\] (\w+)=\[(\d+)\,(.+)\]/
    );

    if (!trees[a1]) trees[a1] = {};
    if (!trees[a2]) trees[a2] = {};

    build(trees[a1], id, +r1, l1);
    build(trees[a2], id, +r2, l2);
  }
}

function buildanswer(node, values, deep = 1) {
  if (!node.value) return;
  if (!values[deep]) values[deep] = [];
  values[deep].push(node.value);
  buildanswer(node.left, values, deep + 1);
  buildanswer(node.right, values, deep + 1);
}

const left = Array(maxdeep).fill(0);
buildanswer(trees['left'], left);
const right = Array(maxdeep).fill(0);
buildanswer(trees['right'], right);

let answer =
  left
    .slice(1)
    .toSorted((a, b) => b.length - a.length)
    .at(0)
    .join('') +
  right
    .slice(1)
    .toSorted((a, b) => b.length - a.length)
    .at(0)
    .join('');

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
