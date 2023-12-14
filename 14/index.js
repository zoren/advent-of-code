const example = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`
import input from './input?raw'
const pattern = input
  .trim()
  .split('\n')
  .map(line => line.split(''))

const inputColums = []
for (let colIndex = 0; colIndex < pattern[0].length; colIndex++) {
  let column = []
  for (let rowIndex = 0; rowIndex < pattern.length; rowIndex++) {
    column.push(pattern[rowIndex][colIndex])
  }
  inputColums.push(column)
}
const width = pattern[0].length
const height = pattern.length
console.log({ width, height })
if (width !== height) throw new Error('Not a square')

const shiftOsColumn = column => {
  const shiftedColumn = [...column]
  for (let i = 0; i < shiftedColumn.length; i++) {
    const char = shiftedColumn[i]
    if (char === 'O' || char === '#') continue
    for (let j = i + 1; j < shiftedColumn.length; j++) {
      if (shiftedColumn[j] === '.') continue
      if (shiftedColumn[j] === '#') {
        i = j
        break
      }
      // swap i and j
      const temp = shiftedColumn[i]
      shiftedColumn[i] = shiftedColumn[j]
      shiftedColumn[j] = temp
      break
    }
  }
  return shiftedColumn
}

const shiftColumns = columns => {
  return columns.map(shiftOsColumn)
}

const turnClockwise = columns => {
  const width = columns[0].length
  const height = columns.length
  const newColumns = []

  for (let rowIndex = height - 1; 0 <= rowIndex; rowIndex--) {
    const newColumn = []
    for (let colIndex = 0; colIndex < width; colIndex++) {
      newColumn.push(columns[colIndex][rowIndex])
    }
    newColumns.push(newColumn)
  }
  return newColumns
}

// const turnedColumns = turnClockwise(columns)
const logCols = columns => {
  for (let rowIndex = 0; rowIndex < columns[0].length; rowIndex++) {
    console.log(columns.map(column => column[rowIndex]).join(''))
  }
}

const calcTotalLoad = cols => {
  let totalLoad = 0
  for (let c = 0; c < cols.length; c++) {
    let currentLineLoad = cols.length
    for (let r = 0; r < cols[0].length; r++) {
      const char = cols[c][r]
      if (char === 'O') totalLoad += currentLineLoad
      currentLineLoad--
    }
  }
  return totalLoad
}

let shifted = inputColums

const configurations = new Map()
const colsToString = cols => cols.map(col => col.join('')).join(',')

const path = []
console.log()

for (let j = 0; j < 200; j++) {
  console.log({ j, tot: calcTotalLoad(shifted) })
  for (let i = 0; i < 4; i++) {
    shifted = shiftColumns(shifted)
    shifted = turnClockwise(shifted)
  }
}

console.log()

shifted = inputColums

const N = 1000000000
for (let j = 0; j < N; j++) {
  const key = colsToString(shifted)
  if (configurations.has(key)) {
    const loopTarget = configurations.get(key)
    const { index } = loopTarget
    const loopSize = j - index
    const remaining = N - index
    const loopIndex = remaining % loopSize
    console.log({
      loopSize,
      remaining,
      startIndex: index,
      loopIndex,
      path,
      result: path[index + loopIndex],
    })
    break
  }
  const tot = calcTotalLoad(shifted)
  path.push(tot)
  configurations.set(key, { tot, index: j  })

  for (let i = 0; i < 4; i++) {
    shifted = shiftColumns(shifted)
    shifted = turnClockwise(shifted)
  }
}