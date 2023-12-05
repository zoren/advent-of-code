// import text from "./mini.txt?raw";
import text from "./input.txt?raw";

const lines = text.split("\n");

const sections = [];
let currentSection = [];
for (const line of lines) {
  if (line === "") {
    sections.push(currentSection);
    currentSection = [];
  } else currentSection.push(line);
}
const [seedsStr, ...mappings] = sections;
const [, ...seeds] = seedsStr[0].split(" ").map((s) => parseInt(s));
let current = seeds;
for (const mapping of mappings) {
  const [header, ...lines] = mapping;
  const ranges = lines.map((line) => {
    const [dest, src, rangeSize] = line.split(" ").map((s) => parseInt(s));
    return { dest, src, rangeSize };
  });
  const newCurrent = [];
  for (const c of current) {
    const range = ranges.find(
      ({ src, rangeSize }) => src <= c && c < src + rangeSize
    );
    if (range) {
      const { src, dest } = range;
      const newC = dest + (c - src);
      newCurrent.push(newC);
    } else {
      newCurrent.push(c);
    }
  }
  current = newCurrent;
}
console.log({ seeds, current, minCurrent: Math.min(...current) });
