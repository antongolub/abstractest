import * as assert from 'node:assert'
import { describe, it, after } from 'node:test'
import { runner, api } from '../../main/ts/runner'
import { temporaryDirectory } from 'tempy'

const _api = {...api}

describe('runner()', () => {
  it('exposes proper api', () => {
    assert.equal(runner.name, 'jest')
    assert.equal(typeof runner.run, 'function')
    assert.equal(typeof runner.api.it, 'function')
    assert.equal(typeof runner.api.describe, 'function')
    assert.equal(typeof runner.api.expect, 'function')
  })

  it('`run()` invokes `spawn` with proper args', async () => {
    const cwd = temporaryDirectory()
    api.spawn = (bin, args, opts) => {
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
      api.it = (_name, _fn) => {
        assert.equal(_name, name)
        assert.equal(_fn, fn)
      }
      await runner.api.it(name, fn)
    })

    it('`describe()` passes args to `jest.describe`', async () => {
      const name = 'foo'
      const fn = () => {}
      api.describe = (_name, _fn) => {
        assert.equal(_name, name)
        assert.equal(_fn, fn)
      }
      await runner.api.describe(name, fn)
    })

    it('`expect()` passes args to `jest.expect`', async () => {
      const a = 'foo'
      api.expect = (_a) => {
        assert.equal(_a, a)
      }
      await runner.api.expect(a)
    })
  })

  after(() => Object.assign(api, _api))
})
