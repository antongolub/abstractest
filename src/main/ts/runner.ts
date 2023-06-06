import {Describe, Runner, SuiteFn, Test, TestFn, Expect} from './interface'
import {nativeRunner} from './runner/native'
import {jestRunner} from './runner/jest'

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
  // await Promise.all(files.map(file => import(file)))
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
