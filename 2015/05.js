/**
 * @param {string} input
 */
export function part1 (input) {
  return input
    .trim()
    .split('\n')
    .filter(isNice).length
}

/**
 * @param {string} string
 */
function isNice (string) {
  return (
    [...string.matchAll(/[aeiou]/g)].length >= 3 &&
    /(\w)(\1)/.test(string) &&
    !/(ab|cd|pq|xy)/.test(string)
  )
}

/**
 * @param {string} input
 */
export function part2 (input) {
  return input
    .trim()
    .split('\n')
    .filter(isNice2).length
}

/**
 * @param {string} string
 */
function isNice2 (string) {
  return /(\w)(\w).*\1\2/.test(string) && /(\w)\w\1/.test(string)
}

/**
 * @returns {Generator<[() => any, any]>}
 */
export function * test () {
  yield [() => part1('ugknbfddgicrmopn'), 1]
  yield [() => part1('aaa'), 1]
  yield [() => part1('jchzalrnumimnmhp'), 0]
  yield [() => part1('haegwjzuvuyypxyu'), 0]
  yield [() => part1('dvszwmarrgswjxmb'), 0]

  yield [() => part2('qjhvhtzxzqqjkmpb'), 1]
  yield [() => part2('xxyxx'), 1]
  yield [() => part2('uurcxstgmygtbstg'), 0]
  yield [() => part2('ieodomkazucvgmuy'), 0]
}
