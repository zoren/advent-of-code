const ex1 = `
.....
.S-7.
.|.|.
.L-J.
.....
`;

const ex2 = `
7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ
`;

const ex3 = `
7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ
`;
import input from "./input?raw";
const lines = input
  .split("\n")
  .map((l) => l.trim().split(""))
  .filter((l) => l.length > 0);
const startingLine = lines.findIndex((l) => l.includes("S"));
const startingCol = lines[startingLine].findIndex((l) => l === "S");
console.log({ startingPosition: startingLine, startingRow: startingCol });

const get = (c, l) => lines[l]?.[c];
const fourNeighbors = (x, y) => [
  [x - 1, y, "W"],
  [x + 1, y, "E"],
  [x, y - 1, "N"],
  [x, y + 1, "S"],
];

// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.
// S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.

const isValidDir = (dir, char) => {
  const valid = {
    N: "|7F",
    S: "|LJ",
    E: "-7J",
    W: "-LF",
  }[dir].includes(char);
  return valid;
};

const newDir = (dir, char) =>
  ({
    N: { "|": "N", 7: "W", F: "E" },
    S: { "|": "S", L: "E", J: "W" },
    E: { "-": "E", 7: "S", J: "N" },
    W: { "-": "W", L: "N", F: "S" },
  }[dir][char]);

const charToConnectingDirs = {
  S: ["N", "S", "E", "W"],
  "|": ["N", "S"],
  "-": ["E", "W"],
  L: ["N", "E"],
  J: ["N", "W"],
  7: ["S", "W"],
  F: ["S", "E"],
};

const getPipes = (px, py) => {
  const connectingDirs = charToConnectingDirs[get(px, py)];
  console.log({ ch: get(px, py), connectingDirs });
  const res = [];
  for (const [x, y, dir] of fourNeighbors(px, py)) {
    const char = get(x, y);
    if (!char || char === ".") continue;
    if (!connectingDirs.includes(dir)) continue;
    if (!isValidDir(dir, char)) continue;
    res.push({ x, y, dir, pipe: char });
  }
  return res;
};

const stepInDir = (x, y, dir) => {
  return {
    W: [x - 1, y],
    E: [x + 1, y],
    S: [x, y + 1],
    N: [x, y - 1],
  }[dir];
};

const visited = new Map();

const mkCrawler = (x, y, dir) => {
  const initx = x;
  const inity = y;
  let steps = 0;
  console.log({ initx, inity, dir });
  return () => {
    // console.log({ x, y, dir });

    const newPos = stepInDir(x, y, dir);
    if (visited.has(newPos[0] + "," + newPos[1])) return;

    const char = get(...newPos);
    // console.log({ newPos, char });
    if (char === "S") return;
    const nextDir = newDir(dir, char);
    // console.log({ char, dir, nextDir });

    if (nextDir === undefined) {
      console.log({ x, y, dir });
      console.error("no next dir");
      process.exit(1);
    }
    x = newPos[0];
    y = newPos[1];
    dir = nextDir;

    steps++;

    visited.set(x + "," + y, steps);
    return true;
  };
};

let pipes = getPipes(startingCol, startingLine);
if (pipes.length !== 2) {
  console.error(
    "initially there should be two connecting pipes: " + pipes.length
  );
  console.error(pipes);
  process.exit(1);
}
console.log(
  "initial directions",
  pipes.map((p) => p.dir)
);
const [d1, d2] = pipes.map((p) => p.dir);
// console.log({ steps1: followPipe(1, 1, "S"), steps2: followPipe(1, 1, "E") });
const crawler1 = mkCrawler(startingCol, startingLine, d1);
const crawler2 = mkCrawler(startingCol, startingLine, d2);
while (true) {
  // if (!crawler1() && !crawler2()) break
  const changed1 = crawler1();
  const changed2 = crawler2();
  if (!changed1 && !changed2) break;
}
// console.log(visited);
console.log(Math.max(...visited.values()));
