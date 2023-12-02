import text from "./input.txt?raw";
// import text from "./mini.txt?raw";
let sum = 0;
let power = 0;
const lines = text.split("\n");
for (const line of lines) {
  if (line === "") continue;
  const [header, rest] = line.split(":");
  const [, gamenr] = header.split(" ");
  const groups = rest.trim().split(";");
  const elements = groups.map((g) =>
    g.split(",").map((e) => e.trim().split(" "))
  );

  const possible = (() => {
    for (const element of elements) {
      // console.log(element);
      for (const [n, c] of element) {
        // console.log({ n, c });
        const max = { red: 12, green: 13, blue: 14 }[c];
        if (parseInt(n) > max) {
          // throw new Error(`n > max for ${c}`)
          return false;
        }
      }
    }
    return true;
  })();
  const e = {
    gamenr,
    elements,
    possible,
  };
  sum += possible ? parseInt(gamenr) : 0;
  console.dir(e, { depth: null });

  {
    const max = { red: 0, green: 0, blue: 0 };
    for (const element of elements) {
      for (const [n, c] of element) {
        max[c] = Math.max(max[c], parseInt(n));
      }
    }
    power += max.red * max.green * max.blue;
  }
}
console.log({ sum, power });
