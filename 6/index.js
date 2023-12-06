let f = (t, ht) => (t - ht) * ht;
let prod = 1
const example = [
  [7, 9],
  [15, 40],
  [30, 200],
];
// Time:        49     97     94     94
// Distance:   263   1532   1378   1851
const input = [
 [49, 263],
  [97, 1532],
  [94, 1378],
  [94, 1851],
]
for (const [t, dist] of input) {
  console.log({ t, dist})
  let winnings = 0
  for (let i = 0; i < t; i++) {
    const travelled = f(t, i);
    console.log({ holdTime: i, travelled, won: travelled > dist });
    if (travelled > dist) {
      // break;
      winnings++;
    }
  }
  prod *= winnings;
  console.log({ winnings });
}
console.log({ prod });