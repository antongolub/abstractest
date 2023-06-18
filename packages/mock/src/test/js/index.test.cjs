const assert = require('node:assert')
const { describe, it } = require('node:test')
const { mock } = require('@abstractest/mock')

describe('cjs', () => {
  it('mock.fn()', () => {
    const m = mock.fn(v => v)

    m.mockReturnValueOnce('foo')
    assert.equal(m('bar'), 'foo')
    assert.equal(m('baz'), 'baz')
    assert.deepEqual(m.mock.calls, [
      ['bar'],
      ['baz'],
    ])
  })
})
