import crypto from 'node:crypto'

/**
 * @param {string} input
 */
export function part1 (input, length = 5) {
  input = input.trim()
  const prefix = '0'.repeat(length)
  let num = -1
  let hash = ''
  while (!hash.startsWith(prefix)) {
    hash = crypto
      .createHash('md5')
      .update(`${input}${++num}`)
      .digest('hex')
  }
  return num
}

/**
 * @param {string} input
 */
export function part2 (input) {
  return part1(input, 6)
}

/**
 * @returns {Generator<[() => any, any]>}
 */
export function * test () {
  yield [() => part1('abcdef'), 609043]
  yield [() => part1('pqrstuv'), 1048970]
}
