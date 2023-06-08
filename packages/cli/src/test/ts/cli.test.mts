import * as assert from 'node:assert'
import { describe, it } from 'node:test'
import * as path from 'node:path'
import {fileURLToPath} from 'node:url'
import {createRequire} from 'node:module'
import {spawn} from '@abstractest/core'

const r = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const script = path.resolve(__dirname, '../../main/ts/cli.ts')
const loader = r.resolve('ts-node/esm')

describe('cli()', () => {
  it('prints help', async () => {
    const {stdout} = await spawn('node', [
      `--loader=${loader}`,
      '--experimental-specifier-resolution=node',
      script,
      '-h'
    ], {
      cwd: process.cwd(),
      env: process.env
    })

    assert.ok(stdout.startsWith(`
  Usage:
    $ abstractest <pattern>`))
  })

  // it('prints version', async () => {
  //   const {stdout} = await spawn('node', [
  //     `--loader=${loader}`,
  //     '--experimental-specifier-resolution=node',
  //     script,
  //     '-v'
  //   ], {
  //     cwd: process.cwd(),
  //     env: process.env
  //   })
  //
  //   assert.equal(stdout, r('../../../package.json').version)
  // })
})
