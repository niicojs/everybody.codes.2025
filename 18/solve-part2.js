import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, nums, timer } from '../utils.ts';

consola.wrapAll();

const day = getCurrentDay();
const isReal = process.argv[2] === 'real';

consola.start('Starting day ' + day, isReal ? '(real)' : '(test)');
const t = timer();

const [one, two] = getRawData().split(/\r?\n\r?\n\r?\n/);
const lines = one.split(/\r?\n/);

const plants = new Map();
const has_connection = new Set();
let last_plant = null;

for (let i = 0; i < lines.length; i++) {
  if (lines[i]?.startsWith('Plant')) {
    const [id, plant_thickness] = nums(lines[i]);
    last_plant = id;
    const plant = { id, plant_thickness, free: 0, connections: [] };
    i++;
    while (i < lines.length && lines[i]?.trim() !== '') {
      if (lines[i].startsWith('- free branch')) {
        const [branch_thickness] = nums(lines[i]);
        plant.free = branch_thickness;
      } else if (lines[i].startsWith('- branch to Plant')) {
        const [to_id, conn_thickness] = nums(lines[i]);
        plant.connections.push({ to_id, conn_thickness });
        has_connection.add(to_id);
      }
      i++;
    }
    plants.set(id, plant);
  }
}

function brightness(plant_id, round) {
  const plant = plants.get(plant_id);
  if (plant.free) return round[plant_id - 1] ? plant.free : 0;

  let total = 0;
  for (const conn of plant.connections) {
    total += conn.conn_thickness * brightness(conn.to_id, round);
  }

  if (total >= plant.plant_thickness) return total;
  return 0;
}

const rounds = two.split(/\r?\n/).map((line) => line.split(' ').map(Number));

let answer = 0;
for (const round of rounds) {
  answer += brightness(last_plant, round);
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
