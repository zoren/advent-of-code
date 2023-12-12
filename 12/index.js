const makeDisambiguousStrings = (str) => {
  if (str.length === 0) return [""];
  const [first] = str;
  if (first === "." || first === "#") {
    const restSols = makeDisambiguousStrings(str.slice(1));
    return restSols.map((sol) => first + sol);
  }
  if (first === "?") {
    const restSols = makeDisambiguousStrings(str.slice(1));
    const dotStrings = restSols.map((sol) => "." + sol);
    const hashStrings = restSols.map((sol) => "#" + sol);
    return [...dotStrings, ...hashStrings];
  }

  throw new Error("Unknown character");
};

const ex1 = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`;
const rec = (springsStr, groupSizes) => {
  console.log("rec", { groupSizes });
  if (springsStr.length === 0) {
    if (groupSizes.length !== 0) return [];
    else return [""];
  }
  if (groupSizes.length === 0) return [];
  const [spring] = springsStr;
  const springsRest = springsStr.slice(1);
  if (spring === ".") {
    return rec(springsRest, groupSizes).map((sol) => spring + sol);
  }
  const [groupSize, ...restGroupSizes] = groupSizes;
  if (spring === "#") {
    const groupChars = springsStr.slice(1, groupSize);
    console.log({ springsStr, groupSize, groupChars });
    if ([...groupChars].some((c) => c === ".")) return [];
    const newGroupSizes =
      groupSize === 1 ? restGroupSizes : [groupSize - 1, ...restGroupSizes];
    return rec(springsRest, newGroupSizes).map((sol) => spring + sol);
  }
  if (spring === "?") {
    const broken = "#" + springsRest;
    const ok = "." + springsRest;
    const guessDamaged = rec(broken, groupSizes);
    const guessNotDamaged = rec(ok, groupSizes);
    return [...guessDamaged, ...guessNotDamaged];
  }
  console.error({ springsStr, groupSizes });
  throw new Error("Unknown character");
};

// const lines = ex1.trim().split("\n");
import input from "./input?raw";
const lines = input.trim().split("\n");

let isValid = (springsStr, groupSizes) => {
  if (groupSizes.some((s) => s === 0)) throw new Error("zero group size");
  if (springsStr.length === 0) return groupSizes.length === 0;
  const [spring] = springsStr;
  if (spring === ".") return isValid(springsStr.slice(1), groupSizes);
  if (spring !== "#") throw new Error("Unknown character");
  const [groupSize] = groupSizes;
  const sub = springsStr.slice(0, groupSize);
  if (sub.length !== groupSize) return false;
  if ([...sub].some((c) => c === ".")) return false;
  if (springsStr[groupSize] === "#") return false;
  return isValid(springsStr.slice(groupSize), groupSizes.slice(1));
};
// isValid("##", [2]);
// isValid(".##", [2]);
// isValid("##.", [2]);
let total = 0;
const procLine = (line) => {
  // for (const line of lines) {
  const [springsStr, groupSizesStr] = line.split(" ");
  const inputGroupSizes = groupSizesStr.split(",").map(Number);

  console.log(line);
  let validCount = 0;
  for (const d of makeDisambiguousStrings(springsStr)) {
    const valid = isValid(d, inputGroupSizes);
    if (valid) validCount++;
    // if (valid) console.log(d, valid);
  }
  total += validCount;
  console.log("----", { validCount });
  // console.log({ springsStr, groupSizes: inputGroupSizes });

  // const sols = rec(springsStr, inputGroupSizes);
  // console.log({ springsStr, sols, numSols: sols.length });
  // break
};
// procLine("???.### 1,1,3");
// procLine("?###???????? 3,2,1");
// procLine("?#?#?#?#?#?#?#? 1,3,1,6");
lines.forEach(procLine);
console.log({ total });
