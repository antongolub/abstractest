import {pathToFileURL} from 'node:url'
import {Runner} from './interface'
import {r} from './util'
import {context} from './context'
import {Expect} from '@abstractest/types'

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
    expect: new Proxy(() => {/* noop */}, {
      apply() {
        return new Proxy(() => {/* noop */}, {
          get(target, prop, receiver) {
            return () => {/* noop */}
          }
        })
      },
      get(target, prop, receiver) {
        if (prop === 'not') {
          return new Proxy(() => {/* noop */}, {
            get(target, prop, receiver) {
              return () => {/* noop */}
            }
          })
        }
        return () => {/* noop */}
      }
    }) as unknown as Expect,
    before() {/* noop */},
    beforeEach() {/* noop */},
    after() {/* noop */},
    afterEach() {/* noop */},
    mock: {
      fn(fn: any) { return Object.assign(fn, { _isMockFunction: true }) },
      spyOn(obj: any, method: any) { return Object.assign(obj[method], { _isMockFunction: true }) },
    },
  },
  async run() {/* noop */}
}

context.runners.set('void', voidRunner)

const stdRunners = new Map([
  ['jest', '@abstractest/jest'],
  ['native', '@abstractest/native'],
])

export const getRunner = (name = process.env.ABSTRACTEST_RUNNER || 'void', nothrow = false): Runner => {
  if (!context.runners.has(name) && !nothrow) {
    throw new Error(`test runner ${name} is not loaded`)
  }

  return context.runners.get(name) as Runner
}

export const run = async (_opts: any) => {
  const {runner: runnerName, include, cwd, injectGlobal} = normalizeOpts(_opts)
  const runner = getRunner(runnerName, true) || await loadRunner(runnerName)

  process.env.ABSTRACTEST_RUNNER = runner.name

  if (injectGlobal) {
    process.env.ABSTRACTEST_INJECT_GLOBAL = 'true'
  }

  await runner.run({include, cwd})
}

export const getRunnerDest = (name: string) => pathToFileURL(r.resolve(stdRunners.get(name) || name)).toString()

export const loadRunner = async (name: string) => {
  const dest = getRunnerDest(name)
  const m = (await import(dest))
  const runner: Runner = m?.runner || m?.default?.runner || m?.default || m

  context.runners.set(runner.name, runner)

  return runner
}

const normalizeOpts = (opts: any = {}): {runner: string, include: string[], cwd: string, injectGlobal: boolean} => {
  const runner = opts.runner || 'void'
  const include = opts.include || ['src/test/**/*.js']
  const cwd = opts.cwd || process.cwd()
  const injectGlobal = opts.injectGlobal || false

  return {
    runner,
    include,
    injectGlobal,
    cwd,
  }
}
