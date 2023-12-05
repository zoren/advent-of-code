import text from "./input.txt?raw";
// import text from "./mini.txt?raw";

let sum = 0;
const lines = text.split("\n");
const lineLength = lines[0].length;
const numberOfLines = lines.length;

const isDigit = (c) => c >= "0" && c <= "9";

// for (let lineNumber = 0; lineNumber < numberOfLines; lineNumber++) {
//   const line = lines[lineNumber];
//   let numberStart = undefined;
//   let col = 0;
//   const nr = () => {
//     if (numberStart !== undefined) {
//       const number = parseInt(line.slice(numberStart, col));
//       const lineBefore = lines[lineNumber - 1] || "";
//       const lineAfter = lines[lineNumber + 1] || "";
//       const from = numberStart === 0 ? 0 : numberStart - 1;
//       const to = col + 1;
//       const hasSymbolRange = (l) =>
//         [...l.slice(from, to)].some((c) => c !== "." && !isDigit(c));
//       const partNr =
//         hasSymbolRange(lineBefore) ||
//         hasSymbolRange(line) ||
//         hasSymbolRange(lineAfter);
//       console.log({
//         numberStart,
//         col,
//         number,
//         b: lineBefore.slice(from, to),
//         a: lineAfter.slice(from, to),
//         from,
//         to,
//         partNr,
//       });
//       if (partNr) sum += number;
//       numberStart = undefined;
//     }
//   };
//   for (const char of line) {
//     if (isDigit(char)) {
//       if (numberStart === undefined) numberStart = col;
//     } else {
//       nr();
//     }
//     col++;
//   }
//   nr();
// }
// console.log({ sum });

let gearRatioSum = 0;

for (let lineNumber = 0; lineNumber < numberOfLines; lineNumber++) {
  const line = lines[lineNumber];
  let numberStart = undefined;
  let col = 0;

  for (const char of line) {
    if (char === "*") {
      // if (numberStart === undefined) numberStart = col;
      const lineBefore = lines[lineNumber - 1] || "";
      const lineAfter = lines[lineNumber + 1] || "";
      const from = col === 0 ? 0 : col - 1;
      const to = col + 2;
      // const digitIndeces = (l) => [...l].map((c, i) => (isDigit(c) ? i : -1))
      // const digitCount = (l) =>
      //   [...l.slice(from, to)].reduce((a, c) => a + (isDigit(c) ? 1 : 0), 0);
      // const countBeforeAfter = (l) => {
      //   const beforeDigitCount = digitCount(l);
      //   const beforeNumberCount =
      //     beforeDigitCount === 3
      //       ? 1
      //       : beforeDigitCount === 2
      //       ? isDigit(l[col])
      //         ? 1
      //         : 2
      //       : beforeDigitCount;
      //   // console.log({col, from, to, part: l.slice(from, to), beforeDigitCount, beforeNumberCount});
      //   return beforeNumberCount
      // }
      const digitIndeces = (lineNo) => {
        const l = lines[lineNo] || "";
        const c = [...l]
          .map((c, i) => [c, i])
          .filter(([c, col]) => isDigit(c) && col >= from && col < to)
          .map(([, i]) => [lineNo, i]);

        if (c.length === 3) return [c[0]];
        if (c.length === 2 && isDigit(l[col])) return [c[0]];
        // return [c[0], c[1]]
        return c;
      };

      const newLocal = digitIndeces(lineNumber - 1);
      const indeces = [
        ...newLocal,
        ...digitIndeces(lineNumber),
        ...digitIndeces(lineNumber + 1),
      ];
      const totalCount = indeces.length;
      // console.log({totalCount, lineBefore, line, lineAfter});
      // const isRatio = hasDigitRange(lineBefore) && hasDigitRange(line) && hasDigitRange(lineAfter);
      console.log({ indeces });

      if (totalCount === 2) {
        const getDigits = (lineNo, index) => {
          const l = lines[lineNo] || "";
          let start = index;
          let end = index;
          for (start = index; start >= 0; start--) {
            if (!isDigit(l[start])) break;
          }
          for (end = index; end < l.length; end++) {
            if (!isDigit(l[end])) break;
          }
          return parseInt(l.slice(start + 1, end));
        };
        const prod = getDigits(...indeces[0]) * getDigits(...indeces[1]);
        gearRatioSum += prod;
        console.log({
          indeces,
          digits: indeces.map(([lineNo, index]) => getDigits(lineNo, index)),
          prod
        });
      }
    }
    col++;
  }
  // nr();
}
console.log({ gearRatioSum });
