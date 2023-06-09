const { describe, it } = require('node:test')
const { expect } = require('@abstractest/expect')

describe('cjs', () => {
  it('expect()', () => {
    expect(true).toEqual(true)
  })
})
