/**
 * @param {string} input
 */
export function part1 (input, numSleighs = 1) {
  const sleighs = new Array(numSleighs).fill(null).map(() => move())
  /** @type {Map<string, number>} */
  const map = new Map()
  increment(map, pos(sleighs[0]))
  return input
    .trim()
    .split('')
    .reduce(
      ({ sleighs, map }, dir, index) => {
        const sleighIndex = index % sleighs.length
        sleighs[sleighIndex] = move(sleighs[sleighIndex], dir)
        return { sleighs, map: increment(map, pos(sleighs[sleighIndex])) }
      },
      { sleighs, map }
    ).map.size
}

/**
 * @param {{ x?: number, y?: number }} [pos]
 */
function pos ({ x = 0, y = 0 } = {}) {
  return `${x}:${y}`
}

/**
 * @template T
 * @param {Map<T, number>} map
 * @param {T} key
 */
function increment (map, key) {
  const value = map.get(key) ?? 0
  return map.set(key, value + 1)
}

/**
 * @param {{ x?: number, y?: number }} [pos]
 * @param {string} [dir]
 */
function move ({ x = 0, y = 0 } = {}, dir) {
  if (dir === '>') return { x: x + 1, y }
  if (dir === 'v') return { x, y: y + 1 }
  if (dir === '<') return { x: x - 1, y }
  if (dir === '^') return { x, y: y - 1 }
  return { x, y }
}

/**
 * @param {string} input
 */
export function part2 (input) {
  return part1(input, 2)
}

/**
 * @returns {Generator<[() => any, any]>}
 */
export function * test () {
  yield [() => part1('>'), 2]
  yield [() => part1('^>v<'), 4]
  yield [() => part1('^v^v^v^v^v'), 2]

  yield [() => part2('^v'), 3]
  yield [() => part2('^>v<'), 3]
  yield [() => part2('^v^v^v^v^v'), 11]
}
