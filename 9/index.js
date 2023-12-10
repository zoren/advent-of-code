const example = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`;
import input from "./input?raw";

const lines = input
  .trim()
  .split("\n")
  .map((l) => l.trim().split(" ").map(Number));
// console.log({lines})
let totalLast = 0;
let totalFirst = 0;
for (const ns of lines) {
  // console.log(ns);
  const allDiffs = [ns]
  let current = ns;
  while (true) {
    let diffs = [];
    for (let i = 0; i < current.length - 1; i++) {
      const diff = current[i + 1] - current[i];
      diffs.push(diff);
    }
    console.log(diffs)
    allDiffs.push(diffs)
    current = diffs;
    if (diffs.every((d) => d === 0)) break;
  }
  let next = 0
  for (let i = allDiffs.length - 1; i >= 0; i--) {
    next += allDiffs[i].at(-1)
    // console.log(allDiffs[i].join(" "), first)
  }
  let first = 0
  for (let i = allDiffs.length - 1; i >= 0; i--) {
    first = allDiffs[i][0] - first
    // console.log(allDiffs[i].join(" "), first)
  }
  totalLast += next
  totalFirst += first
  console.log()
}

console.log({totalFirst, totalLast})
