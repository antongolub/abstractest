const assert = require('node:assert')
const { describe, it } = require('node:test')
const { runner } = require('@abstractest/native')

describe('cjs', () => {
  it('exposes proper api', () => {
    assert.equal(runner.name, 'native')
    assert.equal(typeof runner.run, 'function')
    assert.equal(typeof runner.api.it, 'function')
    assert.equal(typeof runner.api.describe, 'function')
    assert.equal(typeof runner.api.expect, 'function')
  })
})