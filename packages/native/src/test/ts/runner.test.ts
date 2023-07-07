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
    it('`it()` passes args to native `it`', (_ctx, done) => {
      let calls = 0
      const name = 'foo'
      const fn = () => { return Promise.resolve(calls++) }

      _api.it = ((_name, _fn) => {
        assert.equal(_name, name)
        assert.ok(_fn !== fn)
        _fn().then(() => {
          assert.equal(calls, 1)
          done()
        })
      }) as typeof it

      runner.api.it(name, fn)
    })

    it('`it()` handles promises', (_ctx, done) => {
      let calls = 0
      const name = 'foo'
      const fn = () => { calls++ }

      _api.it = ((_name, _fn) => {
        assert.equal(_name, name)
        assert.ok(_fn !== fn)
        _fn()
        assert.equal(calls, 1)
        done()
      }) as typeof it

      runner.api.it(name, fn)
    })

    it('`describe()` passes args to native `describe`', (_ctx, done) => {
      const name = 'foo'
      const fn = () => {}

      _api.describe = ((_name, _fn) => {
        assert.equal(_name, name)
        assert.equal(typeof _fn, 'function')
        done()
      }) as typeof describe

      runner.api.describe(name, fn)
    })

    describe('`expect()`', () => {
      it('provides `toEqual`', () => {
        runner.api.expect('a').toEqual('a')

        assert.throws(() => runner.api.expect('a').toEqual('b'))
      })
    })
  })

  after(() => Object.assign(_api, __api))
})
