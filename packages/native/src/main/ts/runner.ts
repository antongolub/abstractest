import path from 'node:path'
import {describe, it, after, afterEach, before, beforeEach} from 'node:test'
import {pathToFileURL} from 'node:url'
import {Runner, spawn, r} from '@abstractest/core'
import {expect} from '@abstractest/expect'
import glob from 'fast-glob'

export const api = {
  spawn,
  it,
  describe,
  after,
  afterEach,
  before,
  beforeEach
}

export const runner: Runner = {
  name: 'native',
  async run({cwd, include}) {
    const suites: string[] = (await glob(include, {cwd, absolute: true, onlyFiles: true})).map(suite => pathToFileURL(suite).toString())
    const c8 = path.resolve(r.resolve('c8'), '../bin/c8.js')
    const loader = r.resolve('ts-node/esm')
    const script = `process.env.ABSTRACTEST_RUNNER && await (await import('@abstractest/core')).loadRunner(process.env.ABSTRACTEST_RUNNER); await Promise.all(${JSON.stringify(suites)}.map(suite => import(suite)))`

    await api.spawn('node', [
      c8,
      '-r=lcov',
      '-r=text',
      '-o=target/coverage',
      '-x=src/scripts',
      '-x=src/test',
      'node',
      `--loader=${loader}`,
      '--input-type=module',
      '--experimental-specifier-resolution=node',
      '-e', script
    ], {
      cwd,
      env: process.env
    })
  },
  api: {
    expect,
    it(name, fn) {
      return api.it(name, (_ctx, done) => {
        let cb = done
        const result = fn((result) => { cb = () => {/* noop */}; done(result) })

        typeof result?.then == 'function'
          ? result.then(() => cb()).catch(cb)
          : cb()
      })
    },
    describe(name, fn) { return api.describe(name, fn)},
    before(fn) { return api.before(fn) },
    beforeEach(fn) { return api.beforeEach(fn) },
    after(fn) { return api.after(fn) },
    afterEach(fn) { return api.afterEach(fn) },
  }
}
