import path from 'node:path'
import {pathToFileURL} from 'node:url'
import {Runner, r} from '@abstractest/core'
import glob from 'fast-glob'
import {api, _api} from './adapter'

export const runner: Runner = {
  name: 'native',
  async run({cwd, include}) {
    const suites: string[] = (await glob(include, {cwd, absolute: true, onlyFiles: true})).map(suite => pathToFileURL(suite).toString())
    const c8 = path.resolve(r.resolve('c8'), '../bin/c8.js')
    const loader = r.resolve('ts-node/esm')
    const core = r.resolve('@abstractest/core')
    const script = `import {init} from '${core}'; await init(); await Promise.all(${JSON.stringify(suites)}.map(suite => import(suite)))`

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
      '-e', script
    ], {
      cwd,
      env: process.env
    })
  },
  api
}
