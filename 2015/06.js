/**
 * @param {string} input
 */
export function part1 (input) {
  const grid = runInstructions(input, {
    toggle: value => (value === 1 ? 0 : 1),
    'turn on': () => 1,
    'turn off': () => 0
  })
  return Array.from(grid.values()).filter(Boolean).length
}

/**
 * @typedef {'toggle'|'turn on'|'turn off'} CommandString
 * @typedef {Record<CommandString, (value: number) => number>} CommandHandlers
 */

/**
 *
 * @param {string} input
 * @param {CommandHandlers} commands
 */
function runInstructions (input, commands) {
  /** @type {Map<string, number>} */
  const grid = new Map()
  return input
    .trim()
    .split('\n')
    .reduce((grid, line) => {
      const { command, x1, y1, x2, y2 } = parseLine(line)
      const run = commands[command]
      for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
          const key = `${x}:${y}`
          grid.set(key, run(grid.get(key) ?? 0))
        }
      }
      return grid
    }, grid)
}

const LINE_REGEXP = /^(?<command>toggle|turn on|turn off) (?<x1>\d+),(?<y1>\d+) through (?<x2>\d+),(?<y2>\d+)$/

/**
 * @param {string} line
 * @returns {{ command: 'toggle'|'turn on'|'turn off', x1: number, x2: number, y1: number, y2: number }}
 */
function parseLine (line) {
  /** @type {any} */
  const match = line.match(LINE_REGEXP)
  return {
    command: match.groups.command,
    x1: Number.parseInt(match.groups.x1),
    x2: Number.parseInt(match.groups.x2),
    y1: Number.parseInt(match.groups.y1),
    y2: Number.parseInt(match.groups.y2)
  }
}

/**
 * @param {string} input
 */
export function part2 (input) {
  const grid = runInstructions(input, {
    toggle: value => value + 2,
    'turn on': value => value + 1,
    'turn off': value => (value <= 0 ? 0 : value - 1)
  })
  return Array.from(grid.values()).reduce((a, b) => a + b)
}

/**
 * @returns {Generator<[() => any, any]>}
 */
export function * test () {
  yield [() => part1('turn on 0,0 through 999,999'), 1000000]
  yield [
    () => part1('turn on 0,0 through 999,999\ntoggle 0,0 through 999,0'),
    999000
  ]
  yield [
    () =>
      part1(
        'turn on 0,0 through 999,999\ntoggle 0,0 through 999,0\nturn off 499,499 through 500,500'
      ),
    998996
  ]

  yield [() => part2('turn on 0,0 through 0,0'), 1]
  yield [() => part2('toggle 0,0 through 999,999'), 2000000]
}
