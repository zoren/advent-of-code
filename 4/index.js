import text from "./input.txt?raw";
// import text from "./mini.txt?raw";

let sum = 0;
const lines = text.split("\n").filter((s) => s !== "");
let nrCards = 0;
const parseNumbers = (s) =>
  s
    .split(" ")
    .filter((s) => s !== "")
    .map((n) => parseInt(n.trim()));

let copies = new Map();

let cardIndex = 0;
for (const line of lines) {
  const cardNo = ++cardIndex;
  const [, numbers] = line.split(":");
  const [winningStr, mine] = numbers.split("|");
  const winning = new Set(parseNumbers(winningStr));
  const myNumbers = parseNumbers(mine);
  const n = myNumbers.reduce((a, b) => a + Number(winning.has(b)), 0);
  const numberOfCopies = copies.get(cardNo) || 0;

  for (let i = cardNo + 1; i < cardNo + 1 + n; i++) {
    copies.set(i, (copies.get(i) || 0) + 1 + numberOfCopies);
  }
  nrCards += numberOfCopies + 1;
  const res = n ? 2 ** (n - 1) : 0;
  sum += res;
}
console.log({ sum, nrCards });
