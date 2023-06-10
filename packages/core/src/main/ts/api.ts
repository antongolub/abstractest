import {pathToFileURL} from 'node:url'
import {Describe, Runner, SuiteFn, Test, TestFn, Expect, Hook} from './interface'
import {r} from './util'

const voidRunner: Runner = {
  name: 'void',
  api: {
    it() {/* noop */},
    describe() {/* noop */},
    expect() {
      return {
        toEqual(expected: any) {/* noop */}
      }
    },
    before() {/* noop */},
    beforeEach() {/* noop */},
    after() {/* noop */},
    afterEach() {/* noop */},
  },
  async run() {/* noop */}
}

const stdRunners = new Map([
  ['jest', '@abstractest/jest'],
  ['native', '@abstractest/native'],
])

const runners = new Map<string, Runner>([
  ['void', voidRunner]
])

export const it: Test = (name: string, fn: TestFn) =>
  getRunner().api.it(name, fn)

export const describe: Describe = (name: string, fn: SuiteFn) =>
  getRunner().api.describe(name, fn)

export const expect: Expect = (value) =>
  getRunner().api.expect(value)

export const before: Hook = (fn) =>
  getRunner().api.before(fn)

export const beforeEach: Hook = (fn) =>
  getRunner().api.beforeEach(fn)

export const after: Hook = (fn) =>
  getRunner().api.after(fn)

export const afterEach: Hook = (fn) =>
  getRunner().api.afterEach(fn)

export const getRunner = (name = process.env.ABSTRACTEST_RUNNER || 'void', nothrow = false): Runner => {
  if (!runners.has(name) && !nothrow) {
    throw new Error(`test runner ${name} is not loaded`)
  }

  return runners.get(name) as Runner
}
export const run = async (_opts: any) => {
  const {runner: runnerName, include, cwd} = normalizeOpts(_opts)
  const runner = getRunner(runnerName, true) || await loadRunner(runnerName)

  process.env.ABSTRACTEST_RUNNER = runner.name
  await runner.run({include, cwd})
}

export const getRunnerDest = (name: string) => pathToFileURL(r.resolve(stdRunners.get(name) || name)).toString()

export const loadRunner = async (name: string) => {
  const dest = getRunnerDest(name)
  const m = (await import(dest))
  const runner: Runner = m?.runner || m?.default?.runner || m?.default || m

  runners.set(runner.name, runner)

  return runner
}

const normalizeOpts = (opts: any = {}): {runner: string, include: string[], cwd: string} => {
  const runner = opts.runner || 'void'
  const include = opts.include || ['src/test/**/*.js']
  const cwd = opts.cwd || process.cwd()

  return {
    runner,
    include,
    cwd,
  }
}
