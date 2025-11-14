import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const dnas = getDataLines().map((l) => l.split(':')[1]);

function is_compatible(parent1, parent2, child) {
  for (let i = 0; i < parent1.length; i++) {
    if (child[i] !== parent1[i] && child[i] != parent2[i]) return false;
  }
  return true;
}

let [parent1, parent2, child] = ['', '', ''];
if (is_compatible(dnas[0], dnas[1], dnas[2])) {
  parent1 = dnas[0];
  parent2 = dnas[1];
  child = dnas[2];
} else if (is_compatible(dnas[0], dnas[2], dnas[1])) {
  parent1 = dnas[0];
  parent2 = dnas[2];
  child = dnas[1];
} else if (is_compatible(dnas[1], dnas[2], dnas[0])) {
  parent1 = dnas[1];
  parent2 = dnas[2];
  child = dnas[0];
}

function nb_match(dna1, dna2) {
  let res = 0;
  for (let i = 0; i < dna1.length; i++) {
    if (dna1[i] === dna2[i]) res++;
  }
  return res;
}

const one = nb_match(child, parent1);
const two = nb_match(child, parent2);

let answer = one * two;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
