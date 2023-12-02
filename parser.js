const NEWLINE = 10
const SPACE = 32
const OPEN_PAREN = 40
const CLOSE_PAREN = 41
const SEMICOLON = 59

const isNonWordCodePoint = codePoint =>
  codePoint <= SPACE ||
  codePoint === OPEN_PAREN ||
  codePoint === CLOSE_PAREN ||
  codePoint === SEMICOLON

export const parse = inputString => {
  const warnings = []
  const topLevelArray = []
  const stack = [topLevelArray]

  const wordBuffer = []

  const codePoints = [...inputString].map(c => c.codePointAt(0))
  for (let i = 0; i < codePoints.length; i++) {
    const codePoint = codePoints[i]
    if (wordBuffer.length !== 0 && isNonWordCodePoint(codePoint)) {
      stack.at(-1).push(String.fromCodePoint(...wordBuffer))
      wordBuffer.length = 0
    }

    if (codePoint === OPEN_PAREN) {
      const newArray = []
      stack.at(-1).push(newArray)
      stack.push(newArray)
    } else if (codePoint === CLOSE_PAREN) {
      if (stack.length === 1)
        warnings.push({ type: 'extraClosingParen', index: i })
      else stack.pop()
    } else if (codePoint === SEMICOLON) {
      while (i < codePoints.length && codePoints[i] !== NEWLINE) i++
    } else if (codePoint > SPACE) wordBuffer.push(codePoint)
  }
  if (wordBuffer.length !== 0)
    stack.at(-1).push(String.fromCodePoint(...wordBuffer))

  if (stack.length !== 1)
    warnings.push({ type: 'unclosedParens', number: stack.length - 1 })
  return { forms: topLevelArray, warnings }
}
