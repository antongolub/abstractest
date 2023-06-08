import assert from 'node:assert'
import { describe, it } from 'node:test'
import { describe as _describe, it as _it, run } from 'abstractest'

describe('mjs', () => {
  it('exports are callable', () => {
    assert.equal(typeof _it, 'function')
    assert.equal(typeof _describe, 'function')
    assert.equal(typeof run, 'function')
  })
})
