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

const ex4 = `
...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........
`;
import input from "./input?raw";
const lines = ex4
  .split("\n")
  .map((l) => l.trim().split(""))
  .filter((l) => l.length > 0);
const startingLine = lines.findIndex((l) => l.includes("S"));
const startingCol = lines[startingLine].findIndex((l) => l === "S");
console.log({ startingLine, startingCol });

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

const pipeDir = new Map();
const pipeNextDir = new Map();

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
const [d1] = pipes.map((p) => p.dir);
let char;
let dir = d1;
let x = startingCol;
let y = startingLine;
const path = []
const pathObjMap = new Map()
do {
  const pathObj = { x, y, dir };
  path.push(pathObj)
  pathObjMap.set(x + "," + y, pathObj)
  const [nx, ny] = stepInDir(x, y, dir);

  char = get(nx, ny);
  pathObj.char = char
  if (char === 'S') break;
  console.log({ char, nx, ny, dir });

  const nextDir = newDir(dir, char);
  pathObj.nextDir = nextDir
  pathObj.nx = nx
  pathObj.ny = ny
  if (nextDir === undefined) {
    console.log({ x, y, nx, ny, char, dir });
    console.error("no next dir");
    process.exit(1);
  }
  pipeDir.set(nx + "," + ny, dir);
  pipeNextDir.set(x + "," + y, nextDir);

  x = nx;
  y = ny;
  dir = nextDir;
} while (char !== "S");

console.log(pipeDir);
// console.log(Math.max(zz`...visited.values()));
const testInside = (px, py) => {
  // search for a pipe in the four directions
  if (get(px, py) !== ".") {
    console.error("not a . ", { px, py, ch: get(px, py) });
    throw new Error("not a .");
  }
  let dir;
  for (dir of ["N", "S", "E", "W"]) {
    let x = px;
    let y = py;
    while (true) {
      const [nx, ny] = stepInDir(x, y, dir);
      const char = get(nx, ny);

      if (!char) break;
      x = nx;
      y = ny;
      if (char === ".") continue;
      return { x, y, char, dir };
    }
  }
};

const isInside = (searchDir, foundPipeDir) => {
  if (searchDir === "E" && foundPipeDir === "S") return true;
  if (searchDir === "N" && foundPipeDir === "E") return true;
  if (searchDir === "W" && foundPipeDir === "N") return true;
  if (searchDir === "S" && foundPipeDir === "W") return true;
  return false;
};

for (let lineno = 5; lineno < 9; lineno++) {
  const line = lines[lineno];
  for (let col = 0; col < line.length; col++) {
    const char = line[col];
    if (char !== ".") continue;
    const d = testInside(col, lineno);
    if (!d) continue;

    const { x,y,dir } = d;
    // const foundPipeDir = pipeDir.get(x + "," + y);
    // const nextDir = pipeNextDir.get(x + "," + y);
    const po = pathObjMap.get(x + "," + y)
    const foundPipeDir = po.dir
    const nextDir = po.nextDir
    console.log({ lineno, col, searchDir:dir, in: foundPipeDir, out: nextDir, foundChar: po.char }, d);
  }
  console.log();
}
