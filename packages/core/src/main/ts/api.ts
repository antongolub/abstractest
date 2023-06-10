import {Describe, SuiteFn, It, TestFn, Expect, Hook} from './interface'
import {getRunner} from './runner'

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

export const expect: Expect = (value) =>         getRunner().api.expect(value)

export const before: Hook = (fn) =>     getRunner().api.before(fn)

export const beforeEach: Hook = (fn) => getRunner().api.beforeEach(fn)

export const after: Hook = (fn) =>      getRunner().api.after(fn)

export const afterEach: Hook = (fn) =>  getRunner().api.afterEach(fn)
