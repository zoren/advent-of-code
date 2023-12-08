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
let current = [...map.keys()].filter((k) => k[2] === "A");
console.log({ current });
let steps = 0;
for (let i = 0; ; i++) {
  const inst = lr[i % lr.length];
  // console.log({ current, inst });
  if (current.every((c) => c[2] === "Z")) {
    break;
  }
  current = current.map((c) => {
    const { l, r } = map.get(c);
    if (inst === "L") {
      return l;
    } else {
      return r;
    }
  });
  // console.log({ current });
  if (steps % 1000000 === 0) console.log({ steps });
  steps++;
}
console.log({ steps });
