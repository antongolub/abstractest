import path from 'node:path'
import {pathToFileURL} from 'node:url'
import {Runner, r} from '@abstractest/core'
import glob from 'fast-glob'
import {api, _api} from './adapter'

const getCommonPath = (files: string[]): string => {
  const fl = files.length
  if (fl === 0) {
    return ''
  }

  const f0 = files[0]
  const common = fl === 1
    ? f0.lastIndexOf('/') + 1
    : [...(f0)].findIndex((c, i) => files.some(f => f.charAt(i) !== c))

  const p = f0.slice(0, common)
  if (p.endsWith('/')) {
    return p
  }

  return p.slice(0, p.lastIndexOf('/') + 1)
}

export const runner: Runner = {
  name: 'native',
  async run({cwd, include}) {
    const suites: string[] = (await glob(include, {cwd, absolute: true, onlyFiles: true})).map(suite => pathToFileURL(suite).toString())
    const c8 = path.resolve(r.resolve('c8'), '../bin/c8.js')
    const loader = r.resolve('ts-node/esm')
    const core = r.resolve('@abstractest/core')
    const testRoot = getCommonPath(suites)
    const script = `
import {init} from '${core}'
await init()
global.__testRoot = '${testRoot.replace('file://', '')}'
await Promise.all(${JSON.stringify(suites)}.map(suite => {
  global.__testPath = suite.replace('file://', '')
  return import(suite)
}))
`
    await _api.spawn('node', [
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
      '--test-reporter=spec',
      '-e', script
    ], {
      cwd,
      env: process.env
    })
  },
  api
}
