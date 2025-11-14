import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const lines = getDataLines().map((l) => l.split(':'));
const dnas = new Map(lines);
const dna_keys = Array.from(dnas.keys());

function is_compatible(parent1_k, parent2_k, child_k) {
  const parent1 = dnas.get(parent1_k);
  const parent2 = dnas.get(parent2_k);
  const child = dnas.get(child_k);
  for (let i = 0; i < parent1.length; i++) {
    if (child[i] !== parent1[i] && child[i] != parent2[i]) return false;
  }
  return true;
}

function find_two_parents(dna) {
  for (let i = 0; i < dna_keys.length; i++) {
    if (dna_keys[i] === dna) continue;
    for (let j = i + 1; j < dna_keys.length; j++) {
      if (dna_keys[j] === dna) continue;
      if (is_compatible(dna_keys[i], dna_keys[j], dna)) {
        return [dna_keys[i], dna_keys[j]];
      }
    }
  }
  return [];
}

// find parent for each line
const parents = new Map();
for (const dna of dna_keys) {
  const p = find_two_parents(dna);
  parents.set(dna, p);
}

// build family tree
const families = [];
const todo = new Set(dna_keys);
while (todo.size > 0) {
  const start = todo.values().next().value;
  const family = new Set();
  const queue = [start];
  while (queue.length > 0) {
    const current = queue.shift();
    if (family.has(current)) continue;
    family.add(current);
    todo.delete(current);
    const ps = parents.get(current);
    for (const p of ps) {
      if (p && !family.has(p)) {
        queue.push(p);
      }
    }
    // also add children
    for (const [child, ps] of parents.entries()) {
      if (ps.includes(current) && !family.has(child)) {
        queue.push(child);
      }
    }
  }
  families.push(family);
}

const big = Array.from(families)
  .sort((a, b) => b.size - a.size)
  .at(0);

let answer = Array.from(big)
  .map(Number)
  .reduce((acc, c) => acc + c, 0);

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
