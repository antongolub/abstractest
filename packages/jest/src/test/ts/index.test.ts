import * as assert from 'node:assert'
import { describe, it } from 'node:test'
import { runner } from '../../main/ts'

describe('runner()', () => {
  it('exposes proper api', () => {
    assert.equal(runner.name, 'jest')
    assert.equal(typeof runner.run, 'function')
    assert.equal(typeof runner.api.it, 'function')
    assert.equal(typeof runner.api.describe, 'function')
    assert.equal(typeof runner.api.expect, 'function')
  })
})
