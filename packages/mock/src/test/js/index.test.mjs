import assert from 'node:assert'
import { describe, it } from 'node:test'
import { mock } from '@abstractest/mock'

describe('mjs', () => {
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
