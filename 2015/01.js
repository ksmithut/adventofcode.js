/**
 * @param {string} input
 */
export function part1 (input) {
  return input
    .trim()
    .split('')
    .reduce((floor, char) => {
      if (char === '(') return floor + 1
      if (char === ')') return floor - 1
      return floor
    }, 0)
}

/**
 * @param {string} input
 */
export function part2 (input) {
  let floor = 0
  let index = 0
  const length = input.length
  do {
    const char = input[index]
    if (char === '(') floor += 1
    if (char === ')') floor -= 1
    index += 1
  } while (floor >= 0 && index < length)
  return index
}

/**
 * @returns {Generator<[() => any, any]>}
 */
export function * test () {
  yield [() => part1('(())'), 0]
  yield [() => part1('()()'), 0]
  yield [() => part1('((('), 3]
  yield [() => part1('(()(()('), 3]
  yield [() => part1('))((((('), 3]
  yield [() => part1('())'), -1]
  yield [() => part1('))('), -1]
  yield [() => part1(')))'), -3]
  yield [() => part1(')())())'), -3]

  yield [() => part2(')'), 1]
  yield [() => part2('()())'), 5]
}
