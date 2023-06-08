import {pathToFileURL} from 'node:url'
import {Describe, Runner, SuiteFn, Test, TestFn, Expect} from '../interface'
import {r} from '../util'
import {nativeRunner} from './native'
import {jestRunner} from './jest'

const voidRunner: Runner = {
  name: 'void',
  api: {
    it() {},
    describe() {},
    expect() {
      return {
        toEqual(expected: any) {}
      }
    }
  },
  async run() {}
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

export const getRunner = (runnerName = process.env.ABSTRACTEST_RUNNER || 'native'): Runner => {
  process.env.ABSTRACTEST_RUNNER = runnerName
  return runnerName === 'jest' ? jestRunner : nativeRunner
}

export const run = async (_opts: any = {}) => {
  const {runner, include, cwd} = normalizeOpts(_opts)
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

const normalizeOpts = (opts: any = {}): {runner: Runner, include: string[], cwd: string} => {
  const runner = getRunner(opts.runner)
  const include = opts.include || ['src/test/**/*.js']
  const cwd = opts.cwd || process.cwd()

  return {
    runner,
    include,
    cwd,
  }
}
