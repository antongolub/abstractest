const assert = require('node:assert')
const { describe, it } = require('node:test')
const { it:_it, describe: _describe, run } = require('abstractest')

describe('cjs', () => {
  it('exports are callable', () => {
    assert.equal(typeof _it, 'function')
    assert.equal(typeof _describe, 'function')
    assert.equal(typeof run, 'function')
  })
})
