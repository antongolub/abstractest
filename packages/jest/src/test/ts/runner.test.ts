import * as assert from 'node:assert'
import { describe, it, after } from 'node:test'
import { runner } from '../../main/ts/runner'
import { _api } from '../../main/ts/adapter'
import { temporaryDirectory } from 'tempy'

const __api = {..._api}

describe('runner()', () => {
  it('`run()` invokes `spawn` with proper args', async () => {
    const cwd = temporaryDirectory()
    _api.spawn = (bin, args, opts) => {
      assert.equal(bin, 'node')
      assert.deepEqual(opts, {cwd, env: process.env})
      return Promise.resolve({stdout: '', stderr: ''})
    }

    await runner.run({cwd, include: []})
  })

  describe('api', () => {
    it('`it()` passes args to `jest.it`', async () => {
      const name = 'foo'
      const fn = () => {}
      _api.it = (_name, _fn) => {
        assert.equal(_name, name)
        assert.equal(_fn, fn)
      }
      await runner.api.it(name, fn)
    })

    it('`describe()` passes args to `jest.describe`', async () => {
      const name = 'foo'
      const fn = () => {}
      _api.describe = (_name, _fn) => {
        assert.equal(_name, name)
        assert.equal(_fn, fn)
      }
      await runner.api.describe(name, fn)
    })

    it('`expect()` passes args to `jest.expect`', async () => {
      const a = 'foo'
      _api.expect = (_a) => {
        assert.equal(_a, a)
      }
      await runner.api.expect(a)
    })
  })

  after(() => Object.assign(_api, __api))
})
