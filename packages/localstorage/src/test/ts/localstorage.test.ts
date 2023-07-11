import { describe, it } from 'node:test'
import * as assert from 'node:assert'
import { LocalStorage } from '../../main/ts/localstorage'
import type { Mocker } from '@abstractest/types'

describe('LocalStorage', () => {
  it('proto', () => {
    const mock = {fn: v => v} as unknown as Mocker
    const ls = new LocalStorage(mock)

    assert.equal(ls + '', '[object Storage]')
    assert.equal(ls.length, 0)

    ls.setItem('foo', 'bar')
    ls.setItem('baz', 'qux')
    assert.equal(ls.getItem('foo'), 'bar')
    assert.equal(ls.getItem('baz'), 'qux')
    assert.equal(ls.length, 2)
    assert.equal(ls.key(0), 'foo')
    assert.equal(ls.key(1), 'baz')
    assert.equal(ls.key(2), null)

    ls.removeItem('foo')
    ls.removeItem('unknown')
    assert.equal(ls.length, 1)
    assert.equal(ls.getItem('foo'), null)

    ls.clear()
    assert.equal(ls.length, 0)
  })
})
