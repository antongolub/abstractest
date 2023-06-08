import assert from 'node:assert'
import { describe, it } from 'node:test'
import { runner } from '@abstractest/native'

describe('mjs', () => {
  it('exposes proper api', () => {
    assert.equal(runner.name, 'native')
    assert.equal(typeof runner.run, 'function')
    assert.equal(typeof runner.api.it, 'function')
    assert.equal(typeof runner.api.describe, 'function')
    assert.equal(typeof runner.api.expect, 'function')
  })
})
