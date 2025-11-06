import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, nums, sum, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const creates = nums(getRawData().trim());

let answer = sum(Array.from(new Set(creates)));

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
