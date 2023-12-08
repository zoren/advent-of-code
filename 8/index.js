import text from "./input?raw";

const [lr, ...mappings] = text.split("\n").filter((s) => s !== "");
// console.log({ lr, mappings });
const map = new Map();
for (const mapping of mappings) {
  const [from, to] = mapping.split(" = ");
  const [ls, rs] = to.split(", ");
  const l = ls.slice(1);
  const r = rs.slice(0, -1);
  console.log({ from, l, r });
  map.set(from, { l, r });
}
let current = 'AAA'
let steps = 0;
for (let i = 0 ;; i++) {
  const inst = lr[i%lr.length];
  console.log({ current, inst });
  const { l, r } = map.get(current);
  if (current === 'ZZZ') {
    break;
  }
  if (inst === 'L') {
    current = l;
  } else {
    current = r;
  }
  steps++;
}
console.log({ steps });
