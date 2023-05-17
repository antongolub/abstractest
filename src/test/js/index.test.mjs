import assert from 'node:assert'
import { describe, it } from 'node:test'
import { foo } from 'abstractest'

describe('mjs foo()', () => {
  it('is callable', () => {
    assert.equal(foo(), undefined)
  })
})
