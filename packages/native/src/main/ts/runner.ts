import assert from 'node:assert'
import {createRequire} from 'node:module'
import {describe, it} from 'node:test'
import {pathToFileURL} from 'node:url'
import {Runner, spawn} from '@abstractest/core'
import glob from 'fast-glob'

const r = import.meta.url ? createRequire(import.meta.url) : require

export const api = {
  spawn,
  it,
  describe
}

const expect = (input: any) => ({
  toEqual(expected: any) {
    assert.equal(input, expected)
  }
})

export const runner: Runner = {
  name: 'native',
  async run({cwd, include}) {
    const suites: string[] = (await glob(include, {cwd, absolute: true, onlyFiles: true})).map(suite => pathToFileURL(suite).toString())
    const loader = r.resolve('ts-node/esm')
    const script = `await Promise.all(${JSON.stringify(suites)}.map(suite => import(suite)))`

    await api.spawn('c8', [
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
    it(name, fn) {
      return api.it(name, (_ctx, done) => {
        let cb = done
        const result = fn(() => { cb = () => {}; done() })

        return typeof result?.then == 'function'
          ? result.then(cb)
          : cb()
      })
    },
    describe(name, fn) {
      return api.describe(name, fn)
    },
    expect,
  }
}
