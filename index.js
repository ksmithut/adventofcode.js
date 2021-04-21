import process from 'node:process'
import fs from 'node:fs/promises'

/**
 * @param {string} rawYear
 */
function parseYear (rawYear) {
  const year = Number.parseInt(rawYear, 10)
  if (Number.isNaN(year)) {
    throw new TypeError(`Expected year to be a number. Got ${rawYear}`)
  }
  const now = new Date()
  const currentYear = now.getFullYear()
  if (year < 2015 || year > currentYear) {
    throw new RangeError(`Year must be between 2015 and ${currentYear}`)
  }
  return year
}

/**
 * @param {string} rawDay
 */
function parseDay (rawDay) {
  const day = Number.parseInt(rawDay, 10)
  if (Number.isNaN(day)) {
    throw new TypeError(`Expected day to be a number. Got ${rawDay}.`)
  }
  if (day < 1 || day > 25) {
    throw new RangeError(`Day must be between 1 and 25 inclusive. Got ${day}`)
  }
  return day
}

/**
 * @param {string} rawPart
 * @returns {1|2}
 */
function parsePart (rawPart) {
  const part = Number.parseInt(rawPart, 10)
  if (Number.isNaN(part)) {
    throw new TypeError(`Expected day to be a number. Got ${rawPart}`)
  }
  if (part === 1 || part === 2) return part
  throw new RangeError(`Part must be 1 or 2`)
}

/**
 * @param {number} year
 * @param {number} day
 */
function filePath (year, day) {
  const paddedDay = String(day).padStart(2, '0')
  return new URL(`${year}/${paddedDay}.js`, import.meta.url)
}

/**
 * @param {number} year
 * @param {number} day
 */
function inputPath (year, day) {
  const paddedDay = String(day).padStart(2, '0')
  return new URL(`${year}/inputs/${paddedDay}.txt`, import.meta.url)
}

/**
 * @param {number} year
 * @param {number} day
 * @returns {Promise<AdventModule|null>}
 */
async function importDay (year, day) {
  const module = await import(filePath(year, day).toString()).catch(err => {
    if (err.code === 'ERR_MODULE_NOT_FOUND') return null
    throw err
  })
  return module
}

/**
 * @param {number} year
 * @param {number} day
 * @returns {Promise<string|null>}
 */
async function readInput (year, day) {
  const contents = await fs
    .readFile(inputPath(year, day), 'utf-8')
    .catch(err => {
      if (err.code === 'ENOENT') return null
      throw err
    })
  return contents
}

/** @param {string} string */
const green = string => `\u001B[32m${string}\u001B[39m`
/** @param {string} string */
const red = string => `\u001B[31m${string}\u001B[39m`
/** @param {string} string */
const gray = string => `\u001B[90m${string}\u001B[39m`

/**
 * @typedef {object} AdventModule
 * @property {(input: string) => any} part1
 * @property {(input: string) => any} part2
 * @property {() => Generator<[() => any, any]>} test
 */

function getDefaultYear () {
  const now = new Date()
  return String(
    now.getMonth() === 11 ? now.getFullYear() : now.getFullYear() - 1
  )
}

/**
 * @param {string} rawDay
 * @param {string} [rawYear]
 */
async function init (rawDay, rawYear = getDefaultYear()) {
  const day = parseDay(rawDay)
  const year = parseYear(rawYear)

  const module = await importDay(year, day)
  const input = await readInput(year, day)

  if (!module) {
    const template = await fs.readFile(new URL('template.js', import.meta.url))
    const path = filePath(year, day)
    const dir = new URL('.', path)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path, template)
  }
  if (!input) {
    const path = inputPath(year, day)
    const dir = new URL('.', path)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(inputPath(year, day), '')
  }
}

/**
 * @param {string} rawDay
 * @param {string} [rawYear]
 */
async function test (rawDay, rawYear = getDefaultYear()) {
  const day = parseDay(rawDay)
  const year = parseYear(rawYear)

  const module = await importDay(year, day)
  if (!module) {
    console.log(`No module for year ${year} day ${day}`)
    return
  }
  for (const [test, expected] of module.test()) {
    let name = test.toString().replace(/^\(\) => ?/, '')
    const shortestPrefix = name
      .split('\n')
      .filter(Boolean)
      .reduce((prev, curr) => {
        const [prefixPrev] = prev.match(/^ */) ?? ' '.repeat(prev.length)
        const [prefixCurr] = curr.match(/^ */) ?? ' '.repeat(curr.length)
        return prefixCurr.length < prefixPrev.length ? curr : prev
      })
    const [spaces] =
      shortestPrefix.match(/^ */) ?? ' '.repeat(shortestPrefix.length)
    const replaceSpaces = new RegExp(`^${spaces}`)
    name = name
      .split('\n')
      .filter(Boolean)
      .map(line => line.replace(replaceSpaces, ''))
      .join('\n')
    try {
      const start = process.hrtime.bigint()
      const actual = test()
      const end = process.hrtime.bigint()
      const success = actual === expected
      const duration = (Number(end - start) / 1e6).toFixed(2)
      if (success) {
        console.log(`${green('✔')} ${gray(name)} ${duration}ms`)
      } else {
        console.log(
          `${red('✘')} ${gray(name)} => expected: ${expected} actual: ${actual}`
        )
      }
    } catch (error) {
      console.log(`${red('✘')} ${name} => Error`)
      console.error(error)
    }
  }
}

/**
 * @param {string} rawDay
 * @param {string} [rawPart]
 * @param {string} [rawYear]
 */
async function run (rawDay, rawPart = '1', rawYear = getDefaultYear()) {
  const day = parseDay(rawDay)
  const part = parsePart(rawPart)
  const year = parseYear(rawYear)

  const module = await importDay(year, day)
  if (!module) {
    console.log(`No module for year ${year} day ${day}`)
    return
  }
  const input = await readInput(year, day)
  if (!input) {
    console.log(`No input for year ${year} day ${day}`)
    return
  }
  const partFunction = part === 2 ? module.part2 : module.part1
  try {
    console.log()
    const start = process.hrtime.bigint()
    const actual = partFunction(input)
    const end = process.hrtime.bigint()
    const duration = (Number(end - start) / 1e6).toFixed(2)
    console.log(actual)
    console.log()
    console.log(`duration: ${duration}ms`)
  } catch (error) {
    console.error(error)
  }
}

async function main () {
  const [command, ...args] = process.argv.slice(2)
  switch (command) {
    case 'init':
      await init(args[0], args[1])
      break
    case 'test':
      await test(args[0], args[1])
      break
    case 'run':
      await run(args[0], args[1], args[2])
      break
    default:
      console.error(`Unknown command: ${command}`)
      process.exit(1)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
