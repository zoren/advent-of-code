const ex1 = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`;
import input from "./input?raw";
const lines = input.trim().split("\n");
// const emptyLineIndexes = lines.map((l, i) => l.trim().length === 0 ? i : null).filter(l => l !== null)
const lineLength = lines[0].length;
const emptyLineIndexes = [];
const galaxies = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if ([...line].every((c) => c === ".")) {
    emptyLineIndexes.push(i);
  }
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === "#") {
      galaxies.push([i, j]);
    }
  }
}
const emptyColumnIndexes = [];
for (let i = 0; i < lineLength; i++) {
  if (lines.every((l) => l[i] === ".")) {
    emptyColumnIndexes.push(i);
  }
}
console.log({ emptyLineIndexes, emptyColumnIndexes, galaxies });
let sum = 0;
for (let i = 0; i < galaxies.length; i++) {
  const [l1, c1] = galaxies[i];
  for (let j = i + 1; j < galaxies.length; j++) {
    const [l2, c2] = galaxies[j];
    // const lineDiff = g2[0] - galaxy[0]
    // const colDiff = g2[1] - galaxy[1]
    const minLine = Math.min(l1, l2);
    const maxLine = Math.max(l1, l2);
    let emptyLinesCrossed = 0
    for (let k = minLine; k <= maxLine; k++) {
      if(emptyLineIndexes.includes(k)) {
        emptyLinesCrossed++
      }
    }

    const minCol = Math.min(c1, c2);
    const maxCol = Math.max(c1, c2);
    let emptyColumnsCrossed = 0
    for (let k = minCol; k <= maxCol; k++) {
      if(emptyColumnIndexes.includes(k)) {
        emptyColumnsCrossed++
      }
    }

    const dist = (maxLine - minLine) + (maxCol - minCol) + emptyLinesCrossed + emptyColumnsCrossed
    sum += dist
    console.log({ from: i+1, to: j+1, dist, emptyLinesCrossed, emptyColumnsCrossed })
  }
}

console.log({ sum });