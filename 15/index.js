const example = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`
import input from './input?raw'
const hash = s => {
  let h = 0
  for (const c of s) {
    h += c.charCodeAt(0)
    h *= 17
    h %= 256
    // h = (c.charCodeAt(0) * 17 + h) & 0xff
  }
  return h
}
const calc = input => {
  const instructions = input.trim().split(',')

  let sum = 0
  for (const s of instructions) {
    const h = hash(s.trim())
    sum += h
    // console.log(s, h)
  }
  console.log({ sum })
}
// calc(example)
// calc(input)
const hashmap = input => {
  const table = Array.from({ length: 256 }, () => [])
  const instructions = input.trim().split(',').map(s => s.trim())
  for (const inst of instructions) {
    console.log(inst)
    if (inst.endsWith('-')) {
      const label = inst.slice(0, -1)
      const h = hash(label)
      const ar = table[h]
      const i = ar.findIndex(([l]) => l === label)
      if (i !== -1) ar.splice(i, 1)
    } else {
      const [label, value] = inst.split('=')
      const h = hash(label)
      const ar = table[h]
      const i = ar.findIndex(([l]) => l === label)
      if (i !== -1) {
        ar.splice(i, 1)
        ar.splice(i, 0, [label, value])
      } else {
        ar.push([label, value])
      }
    }
    table.forEach((ar, i) => {
      if (ar.length === 0) return
      // console.log(`Box ${i}: ${ar.map(([l, v]) => `[${l} ${v}]`).join(' ')}`)
    })
    // const h = hash(s.trim())
    // console.log(s, h)
  }

  const sumTotal = table.reduce(
    (sum, box, boxIndex) =>
      sum +
      box.reduce(
        (boxSum, [, value], slot) =>
          (boxIndex + 1) * (slot + 1) * parseInt(value) + boxSum,
        0,
      ),
    0,
  )
  console.log({ sumTotal })
  // let sum = 0
  // let boxIndex = 1
  // for (const box of table) {
  //   for (const [label, value] of box) {
  //     // sum += hash(label) * hash(value)
  //   }
  //   boxIndex++
  // }
}
// hashmap(example)
hashmap(input)
