/**
 * @param {string} input
 */
export function part1 (input) {
  return input
    .trim()
    .split('\n')
    .reduce((total, line) => {
      const parsedLine = line
        .replace(/^"(.*)"$/, '$1')
        .replace(/\\x([a-f0-9]{2})/g, (_, code) =>
          String.fromCharCode(Number.parseInt(code, 16))
        )
        .replace(/\\(.)/g, '$1')
      return total + (line.length - parsedLine.length)
    }, 0)
}

/**
 * @param {string} input
 */
export function part2 (input) {
  return input
    .trim()
    .split('\n')
    .reduce((total, line) => {
      const encodedLine = JSON.stringify(line)
      return total + (encodedLine.length - line.length)
    }, 0)
}

/**
 * @returns {Generator<[() => any, any]>}
 */
export function * test () {
  yield [() => part1('""'), 2]
  yield [() => part1('"abc"'), 2]
  yield [() => part1('"aaa\\"aaa"'), 3]
  yield [() => part1('"\\x27"'), 5]

  yield [() => part2('""'), 4]
  yield [() => part2('"abc"'), 4]
  yield [() => part2('"aaa\\"aaa"'), 6]
  yield [() => part2('"\\x27"'), 5]
}
