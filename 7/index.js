const type = (hand) => {
  const cards = hand.split("");
  const hist = {};
  for (const c of cards) {
    hist[c] = (hist[c] || 0) + 1;
  }
  if (cards.every((c) => c === cards[0]))
    return { name: "Five of a kind", rank: 0 };
  const values = Object.values(hist).sort().reverse();
  if (values[0] === 4) return { name: "Four of a kind", rank: 1 };
  if (values[0] === 3 && values[1] === 2)
    return { name: "Full house", rank: 2 };
  if (values[0] === 3) return { name: "Three of a kind", rank: 3 };
  if (values[0] === 2 && values[1] === 2) return { name: "Two pair", rank: 4 };
  if (values[0] === 2) return { name: "Pair", rank: 5 };
  if (values.every((v) => v === 1)) return { name: "High card", rank: 6 };
  throw new Error("Should not happen");
};

const type2 = (hand) => {
  const cards = hand.split("");
  const hist = {};
  for (const c of cards) {
    hist[c] = (hist[c] || 0) + 1;
  }
  const { J, ...restHist } = hist;
  if (J === undefined) return type(hand);

  if (J === 5) return { name: "Five of a kind", rank: 0 };
  if (Object.values(restHist).length === 1)
    return { name: "Five of a kind", rank: 0 };
  const values = Object.values(restHist).sort().reverse();
  if (values[0] + J === 4) return { name: "Four of a kind", rank: 1 };
  if (values[0] + J === 3 && values[1] === 2)
    return { name: "Full house", rank: 2 };
  if (values[0] + J === 3) return { name: "Three of a kind", rank: 3 };
  if (values[0] === 2 && values[1] + J === 2)
    return { name: "Two pair", rank: 4 };
  if (values[0] + J === 2) return { name: "Pair", rank: 5 };
  if (values.every((v) => v === 1)) return { name: "High card", rank: 6 };
  throw new Error(
    "Should not happen: " +
      hand +
      " " +
      JSON.stringify(restHist) +
      " " +
      JSON.stringify(values) +
      " " +
      J
  );
};

const compareHands = (a, b) => {
  const aType = type2(a);
  const bType = type2(b);
  if (aType.rank !== bType.rank) return aType.rank - bType.rank;
  const cardRanking = "AKQT98765432J";
  const aCards = a.split("").map((c) => cardRanking.indexOf(c));
  const bCards = b.split("").map((c) => cardRanking.indexOf(c));
  for (let i = 0; i < aCards.length; i++) {
    if (aCards[i] !== bCards[i]) return aCards[i] - bCards[i];
  }
  return 0;
};

const example = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`;
import text from "./input?raw";
const lines = text
  .trim()
  .split("\n")
  .filter((s) => s !== "");
const hands = lines.map((line) => {
  const [hand, score] = line.split(" ");
  return { hand, type: type2(hand).name, score: parseInt(score) };
});

hands.sort((a, b) => compareHands(a.hand, b.hand));
for (const hand of hands) {
  if (hand.hand.indexOf("J") !== -1) 
  console.log(hand);
}
// console.log(hands);
const count = hands.length;
const res = hands.reduce((acc, { score }, i) => acc + score * (count - i), 0);
console.log(res);
