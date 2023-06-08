import * as assert from 'node:assert'
import { describe, it, after } from 'node:test'
import { runner, api } from '../../main/ts/runner'
import { temporaryDirectory } from 'tempy'

const _api = {...api}

describe('runner()', () => {
  it('`run()` invokes `spawn` with proper args', async () => {
    const cwd = temporaryDirectory()
    api.spawn = (bin, args, opts) => {
      assert.equal(bin, 'c8')
      assert.deepEqual(opts, {cwd, env: process.env})
      return Promise.resolve({stdout: '', stderr: ''})
    }

    await runner.run({cwd, include: []})
  })

  describe('api', () => {
    it('`it()` passes args to native `it`', async () => {
      let calls = 0
      let d = 0
      const name = 'foo'
      const fn = () => { calls++ }

      api.it = ((_name, _fn) => {
        assert.equal(_name, name)
        assert.ok(_fn !== fn)
        _fn({}, () => d++)
        assert.equal(calls, 1)
        assert.equal(d, 1)
      }) as typeof it

      await runner.api.it(name, fn)
    })

    it('`describe()` passes args to native `describe`', async () => {
      const name = 'foo'
      const fn = () => {}

      api.describe = ((_name, _fn) => {
        assert.equal(_name, name)
        assert.equal(_fn, fn)
      }) as typeof describe

      await runner.api.describe(name, fn)
    })

    describe('`expect()`', () => {
      it('provides `toEqual`', () => {
        runner.api.expect('a').toEqual('a')

        assert.throws(() => runner.api.expect('a').toEqual('b'))
      })
    })
  })

  after(() => Object.assign(api, _api))
})
