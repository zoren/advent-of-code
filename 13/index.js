const example = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`;

const findVerticalMirror = (pattern) => {
  const nOfCols = pattern[0].length;
  const colEq = (i, j) => {
    for (let rowIndex = 0; rowIndex < pattern.length; rowIndex++) {
      if (pattern[rowIndex][i] !== pattern[rowIndex][j]) return false;
    }
    return true;
  };
  for (let colIndex = 0; colIndex < pattern[0].length; colIndex++) {
    let next = colIndex + 1;
    if (colEq(colIndex, next)) {
      const mirrorIndex = next;
      // console.log("found vertical mirror", { colIndex, next });
      let localColIndex = colIndex;
      let localNext = next;
      while (true) {
        localColIndex--;
        localNext++;
        if (localColIndex < 0 || localNext >= nOfCols) return mirrorIndex;
        if (!colEq(localColIndex, localNext)) {
          break
        }
      }
    }
  }
};

const findHorizontalMirror = (pattern) => {
  for (let rowIndex = 0; rowIndex < pattern.length; rowIndex++) {
    let next = rowIndex + 1;
    if (pattern[rowIndex] === pattern[next]) {
      const mirrorIndex = next;
      // console.log("found horizontal mirror", { rowIndex, next });
      let localRowIndex = rowIndex;
      let localNext = next;
      while (true) {
        localRowIndex--;
        localNext++;
        if (localRowIndex < 0 || localNext >= pattern.length) return mirrorIndex;
        if (pattern[localRowIndex] !== pattern[localNext]) {
          break;
        }
      }
    }
  }
};
import input from "./input.txt?raw";
const patterns = example.split("\n\n").map((s) => s.trim());

let sumHorizontal = 0;
let sumVertical = 0;

for (const pattern of patterns) {
  console.log(pattern);
  const lines = pattern.split("\n");

  const v = findVerticalMirror(lines);
  console.log("vertical", v);
  const h = findHorizontalMirror(lines);
  console.log("horizontal", h);
  if (h) sumHorizontal += h;
  if (v) sumVertical += v;
  console.log();
}
console.log({
  sumHorizontal,
  sumVertical,
  result: 100 * sumHorizontal + sumVertical,
});
