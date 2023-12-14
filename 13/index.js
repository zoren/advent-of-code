const example = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`

const findVerticalMirror = pattern => {
  const nOfCols = pattern[0].length
  const colEq = (i, j) => {
    for (let rowIndex = 0; rowIndex < pattern.length; rowIndex++) {
      if (pattern[rowIndex][i] !== pattern[rowIndex][j]) return false
    }
    return true
  }
  for (let colIndex = 0; colIndex < pattern[0].length; colIndex++) {
    let next = colIndex + 1
    if (colEq(colIndex, next)) {
      const mirrorIndex = next
      // console.log("found vertical mirror", { colIndex, next });
      let localColIndex = colIndex
      let localNext = next
      while (true) {
        localColIndex--
        localNext++
        if (localColIndex < 0 || localNext >= nOfCols) return mirrorIndex
        if (!colEq(localColIndex, localNext)) {
          break
        }
      }
    }
  }
}

const findHorizontalMirror = pattern => {
  for (let rowIndex = 0; rowIndex < pattern.length; rowIndex++) {
    let next = rowIndex + 1
    if (pattern[rowIndex] === pattern[next]) {
      const mirrorIndex = next
      // console.log("found horizontal mirror", { rowIndex, next });
      let localRowIndex = rowIndex
      let localNext = next
      while (true) {
        localRowIndex--
        localNext++
        if (localRowIndex < 0 || localNext >= pattern.length) return mirrorIndex
        if (pattern[localRowIndex] !== pattern[localNext]) {
          break
        }
      }
    }
  }
}

const countDiffs = (a, b) => {
  let count = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) count++
  }
  return count
}

const searchForMirrorVerticalSmudge = pattern => {
  const nOfCols = pattern[0].length
  const colDiffs = (i, j) => {
    let count = 0
    for (let rowIndex = 0; rowIndex < pattern.length; rowIndex++) {
      if (pattern[rowIndex][i] !== pattern[rowIndex][j]) count++
    }
    return count
  }
  for (let colIndex = 0; colIndex < nOfCols; colIndex++) {
    let localColIndex = colIndex
    let localNext = colIndex + 1
    let totalDiffs = 0
    while (true) {
      if (localColIndex < 0 || localNext >= nOfCols) break
      const diffs = colDiffs(localColIndex, localNext)
      totalDiffs += diffs
      if (totalDiffs > 1) break
      localColIndex--
      localNext++
    }
    if (totalDiffs === 1) return colIndex + 1
  }
}

const searchForMirrorHorizontalSmudge = pattern => {
  for (let rowIndex = 0; rowIndex < pattern.length; rowIndex++) {
    let localRowIndex = rowIndex
    let localNext = rowIndex + 1
    let totalDiffs = 0
    while (true) {
      if (localRowIndex < 0 || localNext >= pattern.length) break
      const diffs = countDiffs(pattern[localRowIndex], pattern[localNext])
      totalDiffs += diffs
      if (totalDiffs > 1) break
      localRowIndex--
      localNext++
    }
    if (totalDiffs === 1) return rowIndex + 1
  }
}

import input from './input.txt?raw'
const patterns = input.split('\n\n').map(s => s.trim())

let sumHorizontal = 0
let sumVertical = 0

let sumHorizontalSmudge = 0
let sumVerticalSmudge = 0
for (const pattern of patterns) {
  console.log(pattern)
  const lines = pattern.split('\n')

  const v = findVerticalMirror(lines)
  console.log('vertical', v)
  const h = findHorizontalMirror(lines)
  console.log('horizontal', h)
  if (h) sumHorizontal += h

  const hSmudge = searchForMirrorHorizontalSmudge(lines)
  console.log('horizontal with fix', hSmudge)
  if (hSmudge) sumHorizontalSmudge += hSmudge

  if (v) sumVertical += v
  const vSmudge = searchForMirrorVerticalSmudge(lines)
  console.log('vertical with fix', vSmudge)
  if (vSmudge) sumVerticalSmudge += vSmudge

  console.log()
}
console.log({
  sumHorizontal,
  sumVertical,
  result: 100 * sumHorizontal + sumVertical,

  sumHorizontalSmudge,
  sumVerticalSmudge,
  resultSmudge: 100 * sumHorizontalSmudge + sumVerticalSmudge,
})
