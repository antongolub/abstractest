import * as assert from 'node:assert'
import {it, describe, expect, after, afterEach, before, beforeEach, mock} from 'abstractest'
import {foo} from '../../main/ts/foo'

describe('foo()', () => {
  let count = 0

  before(() => count++)
  beforeEach(async () => new Promise((resolve, reject) =>
    setTimeout(() => resolve(count++),10)))

  describe('nested', () => {
    it('returns bar', (done) => {
      expect(foo()).toEqual('bar')
      expect(foo()).toBe('bar')
      expect(foo()).toMatchSnapshot()

      expect(count).toEqual(2)
      done()
    })
  })

  it('returns bar (async)', async () => {
    expect(foo()).toEqual('bar')
    expect(count).toEqual(3)
  })

  it.skip('skipped test', () => {})
  it.todo('todo test')
})

describe.skip('skipped suite', () => {})
describe.todo('todo suite')

describe('mock', () => {
  it('works fine', () => {
    const m = mock.fn<(v: string) => string>(v => v)

    m.mockReturnValueOnce('foo')
    assert.equal(m('bar'), 'foo')
    assert.equal(m('baz'), 'baz')
    assert.deepEqual(m.mock.calls, [
      ['bar'],
      ['baz'],
    ])

    expect(m).toHaveBeenCalled()
    expect(m).toHaveBeenCalledTimes(2)
  })
})
