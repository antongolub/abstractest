const assert = require('node:assert')
const { describe, it } = require('node:test')
const { runner } = require('@abstractest/jest')

describe('cjs', () => {
  it('exposes proper api', () => {
    assert.equal(runner.name, 'jest')
    assert.equal(typeof runner.run, 'function')
    assert.equal(typeof runner.api.it, 'function')
    assert.equal(typeof runner.api.describe, 'function')
    assert.equal(typeof runner.api.expect, 'function')
    assert.equal(typeof runner.api.before, 'function')
    assert.equal(typeof runner.api.beforeEach, 'function')
    assert.equal(typeof runner.api.after, 'function')
    assert.equal(typeof runner.api.afterEach, 'function')
  })
})
