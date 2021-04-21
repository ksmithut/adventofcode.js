/**
 * @param {string} input
 */
export function part1 (input) {
  return input
    .trim()
    .split('\n')
    .reduce((total, line) => {
      const [l, w, h] = parseInput(line)
      const sides = [l * w, l * h, w * h]
      const smallestSide = Math.min(...sides)
      const totalPaper = sides.reduce((a, b) => a + b) * 2 + smallestSide
      return total + totalPaper
    }, 0)
}

/**
 * @param {string} input
 */
function parseInput (input) {
  return input.split('x').map(num => Number.parseInt(num, 10))
}

/**
 * @param {string} input
 */
export function part2 (input) {
  return input
    .trim()
    .split('\n')
    .reduce((total, line) => {
      const [a, b, c] = parseInput(line).sort((a, b) => a - b)
      const totalRibbon = a + a + b + b + a * b * c
      return total + totalRibbon
    }, 0)
}

/**
 * @returns {Generator<[() => any, any]>}
 */
export function * test () {
  yield [() => part1('2x3x4'), 58]
  yield [() => part1('1x1x10'), 43]

  yield [() => part2('2x3x4'), 34]
  yield [() => part2('1x1x10'), 14]
}
