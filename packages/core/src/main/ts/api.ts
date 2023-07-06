import {Describe, SuiteFn, It, TestFn, Expect, Hook, Mocker} from './interface'
import {getRunner, loadRunner} from './runner'

export const it: It = Object.assign((name: string, fn?: TestFn) => getRunner().api.it(name, fn), {
  only(name: string, fn?: TestFn) { return getRunner().api.it.only(name, fn) },
  skip(name: string, fn?: TestFn) { return getRunner().api.it.skip(name, fn) },
  todo(name: string, fn?: TestFn) { return getRunner().api.it.todo(name, fn) },
})

export const describe: Describe = Object.assign((name: string, fn?: SuiteFn) => getRunner().api.describe(name, fn), {
  only(name: string, fn?: SuiteFn) { return getRunner().api.describe.only(name, fn) },
  skip(name: string, fn?: SuiteFn) { return getRunner().api.describe.skip(name, fn) },
  todo(name: string, fn?: SuiteFn) { return getRunner().api.describe.todo(name, fn) },
})

export const proxifyExpect = (loader: () => any): Expect => Object.assign(
  (value: any) => loader()(value),
  // Note Proxy is slower
  Object.fromEntries([
    'any',
    'anything',
    'arrayContaining',
    'arrayContaining',
    'closeTo',
    'objectContaining',
    'stringContaining',
    'stringMatching',
    'setState',
  ].map((key) => [key, (...args: any[]) => loader()[key]?.(...args)])),
  {
    not: Object.fromEntries([
      'objectContaining',
      'stringContaining',
      'stringMatching',
    ].map((key) => [key, (...args: any[]) => loader()[key]?.(...args)]))
  }
) as unknown as Expect

export const expect: Expect = proxifyExpect(() => getRunner().api.expect)

export const before: Hook = (fn) =>     getRunner().api.before(fn)

export const beforeEach: Hook = (fn) => getRunner().api.beforeEach(fn)

export const after: Hook = (fn) =>      getRunner().api.after(fn)

export const afterEach: Hook = (fn) =>  getRunner().api.afterEach(fn)

export const mock: Mocker = {
  fn(...args: any[]) { return          getRunner().api.mock.fn(...args) },
  // eslint-disable-next-line
  // @ts-ignore
  spyOn(...args: any) { return                   getRunner().api.mock.spyOn(...args) },
}

export const init = async () => {
  const {
    ABSTRACTEST_RUNNER: runner,
    ABSTRACTEST_INJECT_GLOBAL: injectGlobals = false
  } = process.env

  if (runner) {
    await loadRunner(runner)
  }

  if (injectGlobals) {
    Object.assign(globalThis, {
      it,
      describe,
      expect,
      before,
      beforeEach,
      after,
      afterEach,
      mock
    })
  }
}
