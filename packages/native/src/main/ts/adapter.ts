import {Done, spawn, SuiteFn, Test, TestFn, TestApi} from '@abstractest/core'
import {expect} from '@abstractest/expect'
import {after, afterEach, before, beforeEach, describe, it} from 'node:test'

export const _api = {
  spawn,
  it,
  describe,
  after,
  afterEach,
  before,
  beforeEach
}

const adaptTest = (method: any): Test => (name, fn) =>
  method(name, (_ctx: any, done: Done) => {
    let cb = done
    const result = fn?.((result) => { cb = () => {/* noop */}; done(result) })

    typeof result?.then == 'function'
      ? result.then(() => cb()).catch(cb)
      : cb()
  })

const _it = Object.assign((name: string, fn?: TestFn) => adaptTest(_api.it)(name, fn), {
  only(name: string, fn?: TestFn) { return adaptTest(_api.it.only)(name, fn) },
  skip(name: string, fn?: TestFn) { return adaptTest(_api.it.skip)(name, fn) },
  todo(name: string, fn?: TestFn) { return adaptTest(_api.it.todo)(name, fn) },
})

const _describe = Object.assign((name: string, fn?: SuiteFn) => _api.describe(name, fn), {
  only(name: string, fn?: SuiteFn) { return _api.describe.only(name, fn) },
  skip(name: string, fn?: SuiteFn) { return _api.describe.skip(name, fn) },
  todo(name: string, fn?: SuiteFn) { return _api.describe.todo(name, fn) },
})

export const api: TestApi = {
  expect,
  it: _it,
  describe: _describe,
  before(fn) {        return _api.before(fn) },
  beforeEach(fn) {    return _api.beforeEach(fn) },
  after(fn) {         return _api.after(fn) },
  afterEach(fn) {     return _api.afterEach(fn) },
}
