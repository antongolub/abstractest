import * as assert from 'node:assert'
import * as fs from 'node:fs/promises'
import { describe, it } from 'node:test'
import { loadRunner } from '../../main/ts'
import { temporaryFile } from 'tempy'

describe('util', () => {
  describe('loadRunner()', async () => {
    it('loads cjs if exits', async () => {
      const runnerPath = temporaryFile({name: 'runner.cjs'})
      await fs.writeFile(runnerPath, `
module.exports = {
  runner: {
    name: 'fake',
    api: {
      it() {},
      describe() {},
      expect() {
        return {
          toEqual(expected) {}
        }
      }
    }
  }
}
`)
      const runner = await loadRunner(runnerPath)
      assert.equal(runner.name, 'fake')
    })

    it('loads mjs if exits', async () => {
      const runnerPath = temporaryFile({name: 'runner.mjs'})
      await fs.writeFile(runnerPath, `
export const runner = {
  name: 'fake',
  api: {
    it() {},
    describe() {},
    expect() {
      return {
        toEqual(expected) {}
      }
    }
  }
}
`)
      const runner = await loadRunner(runnerPath)
      assert.equal(runner.name, 'fake')
    })

    it('fails otherwise', async () => {
       try {
         await loadRunner('unknown')
       } catch (e) {
         assert.equal(e.code, 'MODULE_NOT_FOUND')
       }
    })
  })
})
