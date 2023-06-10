import {pathToFileURL} from 'node:url'
import {Runner} from './interface'
import {r} from './util'

const voidRunner: Runner = {
  name: 'void',
  api: {
    it: Object.assign(() => {/* noop */}, {
      only() {/* noop */},
      skip() {/* noop */},
      todo() {/* noop */},
    }),
    describe: Object.assign(() => {/* noop */}, {
      only() {/* noop */},
      skip() {/* noop */},
      todo() {/* noop */},
    }),
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
