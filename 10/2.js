import fs from "fs";

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

const ex5 = `
.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...
`;
import input from "./input?raw";

const lines = input
  .split("\n")
  .map((l) => l.trim().split(""))
  .filter((l) => l.length > 0);
const startingLine = lines.findIndex((l) => l.includes("S"));
const startingCol = lines[startingLine].findIndex((l) => l === "S");
console.log({ startingLine, startingCol });

// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.
// S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.

const getLineColumn = (line, column) => lines[line]?.[column];

const newDir = (dir, char) =>
  ({
    N: { "|": "N", 7: "W", F: "E" },
    S: { "|": "S", L: "E", J: "W" },
    E: { "-": "E", 7: "S", J: "N" },
    W: { "-": "W", L: "N", F: "S" },
  }[dir][char]);

const isValidDir = (dir, char) => {
  const valid = {
    N: "|7F",
    S: "|LJ",
    E: "-7J",
    W: "-LF",
  }[dir].includes(char);
  return valid;
};

const directions = ["E", "N", "W", "S"];

const stepInDir = (line, column, dir) => {
  return {
    N: [line - 1, column],
    S: [line + 1, column],
    E: [line, column + 1],
    W: [line, column - 1],
  }[dir];
};

const isInside = (searchDir, foundPipeDir) => {
  if (searchDir === "E" && foundPipeDir === "S") return true;
  if (searchDir === "N" && foundPipeDir === "E") return true;
  if (searchDir === "W" && foundPipeDir === "N") return true;
  if (searchDir === "S" && foundPipeDir === "W") return true;
  return false;
};

const dirToInt = (dir) => {
  return directions.indexOf(dir);
};

const validInitialDirections = directions.filter((dir) => {
  const [nline, ncol] = stepInDir(startingLine, startingCol, dir);
  const char = getLineColumn(nline, ncol);
  return isValidDir(dir, char);
});
console.log({ validInitialDirections });

const run = (initialDir) => {
  console.log("choosing initial dir", initialDir);

  let dir = initialDir;
  let char;
  let line = startingLine;
  let column = startingCol;

  const pathMap = new Map();
  const path = [];

  do {
    const [nline, ncolumn] = stepInDir(line, column, dir);
    char = getLineColumn(nline, ncolumn);
    const pathChar = char;
    const pathObj = { l: nline, c: ncolumn, pathChar, dir };
    path.push(pathObj);
    pathMap.set(nline + "," + ncolumn, pathObj);

    if (char === "S") break;

    const nextDir = newDir(dir, char);
    pathObj.nextDir = nextDir;
    if (nextDir === undefined) {
      console.log({ ncolumn, nline, char, dir });
      console.error("no next dir");
      process.exit(1);
    }
    line = nline;
    column = ncolumn;

    dir = nextDir;
  } while (true);

  let lCount = 0;
  let rCount = 0;
  for (const p of path) {
    const { dir, nextDir } = p;
    if (dir !== nextDir) {
      const prevDirInt = dirToInt(dir);
      const nextDirInt = dirToInt(nextDir);
      // console.log({prevDirInt, nextDirInt})
      if (prevDirInt === (nextDirInt + 1) % 4) {
        p.lr = "turn right";
        rCount++;
      } else {
        p.lr = "turn left";
        lCount++;
      }
    }
    // console.log({ ...p });
  }
  console.log({ pathLength: path.length });
  console.log({ lCount, rCount });
  if (lCount > rCount) {
    console.log("inside is on left");
  } else {
    console.log("inside is on right");
  }

  const isRightPath = lCount < rCount;
  if (!isRightPath) return;

  const testInside = (line, column) => {
    for (const searchDir of directions) {
      let currentLine = line;
      let currentCol = column;
      while (true) {
        const [newLineNo, newCol] = stepInDir(
          currentLine,
          currentCol,
          searchDir
        );
        const char = getLineColumn(newLineNo, newCol);
        if (!char) break;
        currentLine = newLineNo;
        currentCol = newCol;

        if (pathMap.get(newLineNo + "," + newCol)) {
          return { line: currentLine, col: currentCol, char, searchDir };
        }
        // return { line: currentLine, col: currentCol, char, searchDir };
      }
    }
  };
  for (const [l, c] of [
    [62, 77],
    [62, 78],
  ]) {
    const d = testInside(l, c);
    console.log("testInside", { l, c, d });
  }

  let insideCount = 0;
  let insideSet = new Set();

  for (let lineno = 0; lineno < lines.length; lineno++) {
    const line = lines[lineno];
    for (let col = 0; col < line.length; col++) {
      if (pathMap.get(lineno + "," + col)) continue;
      const char = line[col];
      // if (char !== ".") continue;
      const d = testInside(lineno, col);
      if (!d) continue;

      const pathObj = pathMap.get(d.line + "," + d.col);
      if (!pathObj) continue;
      const { searchDir } = d;
      const { dir, nextDir } = pathObj;
      // const inside = isInside(d.searchDir, dir) || isInside(d.searchDir, nextDir);
      let inside = false;
      const oppositeSearchDir = (dirToInt(searchDir) + 2) % 4;
      if (dir !== searchDir && dirToInt(dir) !== oppositeSearchDir) {
        inside = isInside(searchDir, dir);
      } else if (
        nextDir !== searchDir &&
        dirToInt(nextDir) !== oppositeSearchDir
      ) {
        inside = isInside(searchDir, nextDir);
      }

      if (inside) {
        insideCount++;
        insideSet.add("" + lineno + "," + col);
      }
    }
  }
  console.log({ insideCount, insideSetSize: insideSet.size });

  const htmlFileName = `table.html`;

  fs.writeFileSync(
    htmlFileName,
    `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Table</title>
    <style>
        table {
            border-collapse: collapse;
        }
        td {
            width: 1em;
            height: 1em;
            border: 0px;
            margin: 0px;
        }

    </style>  
    <body>
`
  );

  fs.appendFileSync(htmlFileName, '<table style="border-collapse: collapse;">');
  let lineNo = 0;
  for (const line of lines) {
    fs.appendFileSync(htmlFileName, "<tr>");
    let tds = "";
    let colNo = 0;
    for (const ch of line) {
      const pathObj = pathMap.get(lineNo + "," + colNo);
      const arrow = pathObj && pathObjToArrow(pathObj);
      const inside = insideSet.has(lineNo + "," + colNo);
      // const isDot = ch === ".";
      const char = !pathObj ? (inside ? "🟥" : "⬜️") : arrow || ""; //|| boxChar(ch);
      // const char =  boxChar(ch);
      const title =
        lineNo +
        ":" +
        colNo +
        " " +
        ch +
        " " +
        (pathObj ? pathObj.dir + ", " + pathObj.nextDir : "");
      const td = `<td style="width: 1em; height: 1em;" title="${title}">${char}</td>`;
      tds += td;
      colNo++;
    }
    fs.appendFileSync(htmlFileName, tds);

    fs.appendFileSync(htmlFileName, "</tr>\n");
    lineNo++;
  }
  fs.appendFileSync(
    htmlFileName,
    `</table>
</body>
</html>
`
  );
};

const boxChar = (char) => {
  return {
    "|": "│",
    "-": "─",
    L: "└",
    J: "┘",
    7: "┐",
    F: "┌",
    S: "🐻",
    ".": "",
  }[char];
};

const pathObjToArrow = ({ dir, nextDir }) => {
  if (dir === nextDir) {
    if (dir === "S") return "↓";
    if (dir === "N") return "↑";
    if (dir === "E") return "→";
    if (dir === "W") return "←";
  }
  // return
  if (dir === "S" && nextDir === "E") return "↘";
  // if (dir === "S" && nextDir === "W") return "↙";
  if (dir === "E" && nextDir === "N") return "↗";
  if (dir === "E" && nextDir === "S") return "↗";
  if (dir === "N" && nextDir === "W") return "↖";
  if (dir === "N" && nextDir === "E") return "↗";
  if (dir === "W" && nextDir === "N") return "↖";
  if (dir === "W" && nextDir === "S") return "↙";
  if (dir === "S" && nextDir === "W") return "↙";

  return;
  const prevDirInt = dirToInt(dir);
  const nextDirInt = dirToInt(nextDir);
  const sum = (prevDirInt + nextDirInt) % 4;
  const chars = ["↗", "↖", "↙", "↘"];
  const char = chars[sum];
  return char;
  // if (dir === "N" && nextDir === "E") return "↘";
  // if (dir === "N" && nextDir === "W") return "↙";
  // if (dir === "S" && nextDir === "E") return "↘";
  // if (dir === "S" && nextDir === "W") return "↖";
  // if (dir === "W" && nextDir === "S") return "↘";
  // if (dir === "W" && nextDir === "N") return "↗";
  // if (dir === "E" && nextDir === "S") return "↙";
  // if (dir === "E" && nextDir === "N") return "↖";
  return "?" + dir + nextDir;
};
run(validInitialDirections[0]);
run(validInitialDirections[1]);
