import {Done, spawn, SuiteFn, Test, TestFn, TestApi} from '@abstractest/core'
import {Mocker} from '@abstractest/types'
import {expect, SnapshotState} from '@abstractest/expect'
import {mock} from '@abstractest/mock'
import {after, afterEach, before, beforeEach, describe, it} from 'node:test'
import * as path from 'node:path'

export const _api = {
  spawn,
  it,
  describe,
  after,
  afterEach,
  before,
  beforeEach,
  mock
}

const g: any = global

g.__currentTestName = (g.__currentTestName || [])

const names: string[] = []

const adaptTest = (method: any): Test => (name, fn) => {
  g.__currentTestName.push(name)

  names.push(g.__currentTestName.join(' '))

  const handler = (done = (_result?: any) => {/* noop */}) => {
    let save = () => {/* noop */} // eslint-disable-line unicorn/consistent-function-scoping

    if (g.__testPath && g.__testRoot) {
      const currentTestName = names.shift()
      const testPath = g.__testPath
      const snapshotPath = path.join(g.__testRoot, '__snapshots__', `${path.basename(testPath)}.snap`)
      const snapshotState = new SnapshotState(snapshotPath, {
        expand: undefined,
        snapshotFormat: { escapeString: false, printBasicPrototype: false },
        updateSnapshot: 'new',
        rootDir: process.cwd(),
        prettierPath: 'prettier',
        // rootDir: config.rootDir,
        // snapshotFormat: config.snapshotFormat,
        // updateSnapshot: globalConfig.updateSnapshot,
      });

      save = () => {
        snapshotState.save()
        // eslint-disable-next-line
        // @ts-ignore
        expect?.setState({snapshotState: undefined, testPath: undefined, currentTestName: undefined})
      }
      // eslint-disable-next-line
      // @ts-ignore
      expect?.setState({snapshotState, testPath, currentTestName})
    }

    let cb = (result?: any) => { save(); done(result); cb = () => {/* noop */}}
    const result = fn?.(cb)

    return typeof result?.then == 'function'
      ? result.then(() => cb()).catch(cb)
      : cb()
  }

  // TODO refactor workaround
  if (/^[^(]+\([^)]+,/.test(fn?.toString() + '')) {
    method(name, (_ctx: any, done: Done) => handler(done))
  } else {
    method(name, () => handler())
  }

  g.__currentTestName.pop()
}

const _it = Object.assign((name: string, fn?: TestFn) => adaptTest(_api.it)(name, fn), {
  only(name: string, fn?: TestFn) { return adaptTest(_api.it.only)(name, fn) },
  skip(name: string, fn?: TestFn) { return adaptTest(_api.it.skip)(name, fn) },
  todo(name: string, fn?: TestFn) { return adaptTest(_api.it.todo)(name, fn) },
})

const _describe = Object.assign((name: string, fn?: SuiteFn) => {
  return _api.describe(name, (...args: any[]) => {
    g.__currentTestName.push(name)
    // eslint-disable-next-line
    // @ts-ignore
    fn(...args)
    g.__currentTestName.pop()
  })
}, {
  only(name: string, fn?: SuiteFn) { return _api.describe.only(name, fn) },
  skip(name: string, fn?: SuiteFn) { return _api.describe.skip(name, fn) },
  todo(name: string, fn?: SuiteFn) { return _api.describe.todo(name, fn) },
})

const _mock: Mocker = {
  // eslint-disable-next-line
  // @ts-ignore
  spyOn(...args: any[]) {                 return _api.mock.spyOn(...args) },
  // eslint-disable-next-line
  // @ts-ignore
  fn(...args: any[]) {          return _api.mock.fn(...args) },
}

export const api: TestApi = {
  expect,
  it: _it,
  describe: _describe,
  before(fn) {        return _api.before(fn) },
  beforeEach(fn) {    return _api.beforeEach(fn) },
  after(fn) {         return _api.after(fn) },
  afterEach(fn) {     return _api.afterEach(fn) },
  mock: _mock,
}
