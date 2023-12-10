import fs from "fs";
// import ex3 from "./ex3?raw";
// import text from "./input?raw";

// const [lr, ...mappings] = (fs.readFileSync("./ex3", "utf8")).split("\n").filter((s) => s !== "");
const [lr, ...mappings] = fs
  .readFileSync("./input", "utf8")
  .split("\n")
  .filter((s) => s !== "");
// console.log({ lr, mappings });
const map = new Map();
const lmap = new Map();
const rmap = new Map();
const allStrings = new Set();
for (const mapping of mappings) {
  const [from, to] = mapping.split(" = ");
  const [ls, rs] = to.split(", ");
  const l = ls.slice(1);
  const r = rs.slice(0, -1);
  console.log({ from, l, r });
  map.set(from, { l, r });
  lmap.set(from, l);
  rmap.set(from, r);
  allStrings.add(l);
  allStrings.add(r);
  allStrings.add(from);
}
const current = [...map.keys()].filter((k) => k[2] === "A");
const ending = new Set([...map.keys()].filter((k) => k[2] === "Z"));
let sum = 0;
let prod = 1;
const ns = []
for (const start of current) {
  // let steps
  let current = start;
  const seen = new Set();
  for (let i = 0; ; i++) {
    if (ending.has(current)) {
      console.log({ start, current, i });
      sum += i;
      prod *= i;
      ns.push(i)
      break;
    }

    const c = lr[i % lr.length];
    if (c === "L") {
      current = lmap.get(current);
    } else {
      current = rmap.get(current);
    }
  }
  // ending.delete(c);
}

console.log({ sum, prod, ns, dd: ns.map(i=>17099847107071/i) });
ns.sort((a,b)=>a-b)
console.log({ns})
const is = [...ns]
for (let i = 0; i < 10; i++) {
  const min = Math.min(...is)
  for (let j = 0; j < is.length; j++) {
    is[j] -= min
    if (is[j] === 0) {
      is[j] = ns[j]
    }
  }
  if(is.every(i=>i===0)) {
    break
  }
  console.log({min, is})
}
// const allStringsArr = [...allStrings];
// function reverseString(str) {
//   var splitString = str.split(""); // var splitString = "hello".split("");
//   var reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
//   var joinArray = reverseArray.join(""); // var joinArray = ["o", "l", "l", "e", "h"].join("");
//   return joinArray; // "olleh"
// }
// allStringsArr.sort((a, b) => reverseString(a).localeCompare(reverseString(b)));
// console.log({ current, ending, allStrings, allStringsArr });
// const stringToIndex = new Map();
// for (let i = 0; i < allStringsArr.length; i++) {
//   const s = allStringsArr[i];
//   stringToIndex.set(s, i);
// }
// console.log({ stringToIndex });

// let steps = 0;
// let perf = performance.now();
// const instCount = lr.length;

// const currentArray = new Uint16Array(current.map((s) => stringToIndex.get(s)));

// const lmapArray = new Uint16Array(
//   [...lmap]
//     .map(([k, v]) => [stringToIndex.get(k), stringToIndex.get(v)])
//     .sort((a, b) => a[0] - b[0])
//     .map(([, v]) => v)
// );
// const rmapArray = new Uint16Array(
//   [...rmap]
//     .map(([k, v]) => [stringToIndex.get(k), stringToIndex.get(v)])
//     .sort((a, b) => a[0] - b[0])
//     .map(([, v]) => v)
// );

// const intInsts = new Uint8Array(instCount);
// for (let i = 0; i < instCount; i++) {
//   intInsts[i] = lr[i] === "L" ? 0 : 1;
// }
// const endingIndex = allStringsArr.findIndex((s) => s[2] === "Z");
// console.log({ endingIndex });
// (() => {
//   while (true) {
//     for (let i = 0; i < intInsts.length; i++) {
//       const inst = intInsts[i];
//       // if (currentArray.every((c) => c >= endingIndex)) {
//       //   return;
//       // }
//       let allEnding = true;
//       for (let i = 0; i < currentArray.length; i++) {
//         const c = currentArray[i];
//         if (c < endingIndex) {
//           allEnding = false;
//           break;
//         }
//       }
//       if (allEnding) {
//         return;
//       }

//       if (inst === 0) {
//         for (let i = 0; i < currentArray.length; i++) {
//           const c = currentArray[i];
//           currentArray[i] = lmapArray[c];
//         }
//       } else {
//         for (let i = 0; i < currentArray.length; i++) {
//           const c = currentArray[i];
//           currentArray[i] = rmapArray[c];
//         }
//       }

//       // console.log({ current });

//       steps++;
//       if ((steps & 0xffffff) === 0) {
//         const elapsed = (performance.now() - perf) / 1000;
//         console.log({ steps, elapsed, currentArray });
//         perf = performance.now();
//       }
//     }
//   }
// })();
// console.log({ steps });
