import fs from "fs";
import input from "./input?raw";

const lines = input
  .split("\n")
  .map((l) => l.trim().split(""))
  .filter((l) => l.length > 0);

fs.writeFileSync("table.html", `
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
`);

fs.appendFileSync("table.html", '<table style="border-collapse: collapse;">');
for (const line of lines) {
  fs.appendFileSync("table.html", '<tr>');
  let tds = ""
  for (const ch of line) {
    const char = {
      "|": "│",
      "-": "─",
      L: "└",
      J: "┘",
      7: "┐",
      F: "┌",
      S: "🐻",
      '.': ""
    }[ch];
    const td = `<td style="width: 1em; height: 1em;">${char}</td>`
    tds += td
  }
  fs.appendFileSync("table.html", tds);

  fs.appendFileSync("table.html", '</tr>\n');
}
fs.appendFileSync("table.html", `</table>
</body>
</html>
`);
