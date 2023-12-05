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
let current = [];
for (let i = 0; i < seeds.length; i += 2) {
  const [start, n] = seeds.slice(i, i + 2);
  current.push({ start, n });
}
current.sort((a, b) => a.start - b.start);
console.log({ seeds, current });
for (const mapping of mappings) {
  const [, ...lines] = mapping;
  const ranges = lines.map((line) => {
    const [dest, src, rangeSize] = line.split(" ").map((s) => parseInt(s));
    return { src, dest, rangeSize };
  });
  ranges.sort((a, b) => a.src - b.src);
  const newCurrent = [];
  const push = (start, n) => {
    if (n) newCurrent.push({ start, n });
  };
  for (let { start, n } of current) {
    const end = start + n - 1;
    const overlappingRanges = ranges.filter(
      ({ src, rangeSize }) => src <= end && src + rangeSize > start
    );
    // console.log({ start, n, overlappingRanges });
    for (let i = 0; i < overlappingRanges.length; i++) {
      const { src, dest, rangeSize } = overlappingRanges[i];
      if (start < src) {
        n = n - (src - start);
        push(start, n);
        start = src;
      }
      const minLen = Math.min(n, rangeSize);
      const maxStart = Math.max(start, src);
      push(dest + (maxStart - src), minLen);
      start = src + rangeSize;
      n -= minLen;
    }
    push(start, n);
  }
  // console.log({ newCurrent });

  current = newCurrent;
}
current.sort((a, b) => a.start - b.start);
console.log({ current, minCurrent: current[0] });
