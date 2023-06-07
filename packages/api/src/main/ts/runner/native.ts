import assert from 'node:assert'
import {it, describe} from 'node:test'
import {pathToFileURL} from 'node:url'
import {createRequire} from 'node:module'
import glob from 'fast-glob'

import {Runner} from '../interface'
import {spawn} from './util'

const expect = (input: any) => ({
  toEqual(expected: any) {
    assert.equal(input, expected)
  }
})

export const nativeRunner: Runner = {
  name: 'native',
  async run({cwd, include}) {
    const require = createRequire(import.meta.url)
    const suites: string[] = (await glob(include, {cwd, absolute: true, onlyFiles: true})).map(suite => pathToFileURL(suite).toString())

    const loader = require.resolve('ts-node/esm')
    const script = `await Promise.all(${JSON.stringify(suites)}.map(suite => import(suite)))`
    const {stdout, stderr} = await spawn('c8', [
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
      return it(name, async (_ctx, done) => { await fn(done); done() })
    },
    describe(name, fn) {
      return describe(name, fn)
    },
    expect,
  }
}
