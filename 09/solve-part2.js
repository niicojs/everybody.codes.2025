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

function nb_match(dna1_k, dna2_k) {
  const dna1 = dnas.get(dna1_k);
  const dna2 = dnas.get(dna2_k);
  let res = 0;
  for (let i = 0; i < dna1.length; i++) {
    if (dna1[i] === dna2[i]) res++;
  }
  return res;
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

let answer = 0;

// find parent for each line
const parents = new Map();
for (const dna of dna_keys) {
  const p = find_two_parents(dna);
  parents.set(dna, p);
  if (p.length > 0) {
    answer += nb_match(p[0], dna) * nb_match(p[1], dna);
  }
}

consola.log(parents);

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
