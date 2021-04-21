/**
 * @param {string} input
 */
export function part1 (input, wire = 'a') {
  const program = parseProgram(input)
  return program[wire]()
}

const LINE_REGEXP = /^((?<left>[a-z0-9]+) )?((?<operator>AND|OR|LSHIFT|RSHIFT|NOT) )?(?<right>[a-z0-9]+) -> (?<target>\w+)$/

/**
 * @typedef {{ left: undefined, operator: undefined, right: string, target: string }} AssignOperation
 * @typedef {{ left: string, operator: 'AND', right: string, target: string }} AndOperation
 * @typedef {{ left: string, operator: 'OR', right: string, target: string }} OrOperation
 * @typedef {{ left: string, operator: 'LSHIFT', right: string, target: string }} LeftShiftOperation
 * @typedef {{ left: string, operator: 'RSHIFT', right: string, target: string }} RightShiftOperation
 * @typedef {{ left: undefined, operator: 'NOT', right: string, target: string }} NotOperation
 * @typedef {AssignOperation|AndOperation|OrOperation|LeftShiftOperation|RightShiftOperation|NotOperation} Operation
 */

/**
 * @param {string} line
 * @returns {Operation}
 */
function parseLine (line) {
  /** @type {any} */
  const match = line.match(LINE_REGEXP)
  return match.groups
}

/**
 * @template T
 * @param {() => T} fn
 */
function memoize (fn) {
  /** @type {T} */
  let value
  let called = false
  return () => {
    if (!called) {
      value = fn()
      called = true
    }
    return value
  }
}

/**
 * @template T
 * @param {T} value
 * @param  {...any} args
 * @returns T
 */
function log (value, ...args) {
  console.log(value, ...args)
  return value
}

/**
 * @param {string} input
 */
function parseProgram (input) {
  /** @type {Record<string, () => number>} */
  const program = {}
  /**
   * @param {string} value
   */
  function getValueFunction (value) {
    const numValue = Number.parseInt(value, 10)
    return Number.isNaN(numValue) ? () => program[value]() : () => numValue
  }
  return input
    .trim()
    .split('\n')
    .reduce((program, line) => {
      const operation = parseLine(line)
      /** @type {() => number} */
      let func
      switch (operation.operator) {
        case undefined: {
          const right = getValueFunction(operation.right)
          func = () => right()
          break
        }
        case 'AND': {
          const left = getValueFunction(operation.left)
          const right = getValueFunction(operation.right)
          func = () => left() & right()
          break
        }
        case 'OR': {
          const left = getValueFunction(operation.left)
          const right = getValueFunction(operation.right)
          func = () => left() | right()
          break
        }
        case 'LSHIFT': {
          const left = getValueFunction(operation.left)
          const right = getValueFunction(operation.right)
          func = () => left() << right()
          break
        }
        case 'RSHIFT': {
          const left = getValueFunction(operation.left)
          const right = getValueFunction(operation.right)
          func = () => left() >> right()
          break
        }
        case 'NOT': {
          const right = getValueFunction(operation.right)
          func = () => ~right()
          break
        }
        default:
          throw new Error('invalid operation')
      }
      program[operation.target] = memoize(func)
      return program
    }, program)
}

/**
 * @param {string} input
 */
export function part2 (input) {
  const value = part1(input)
  const program = parseProgram(input)
  program.b = memoize(() => value)
  return program.a()
}

/**
 * @returns {Generator<[() => any, any]>}
 */
export function * test () {
  yield [
    () =>
      part1(
        '123 -> x\n456 -> y\nx AND y -> d\nx OR y -> e\nx LSHIFT 2 -> f\ny RSHIFT 2 -> g\nNOT x -> h\nNOT y -> i',
        'x'
      ),
    123
  ]
}
