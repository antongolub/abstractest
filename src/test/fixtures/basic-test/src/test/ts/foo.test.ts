import {it, describe, expect} from 'abstractest'
import {foo} from '../../main/ts/foo'

describe('foo()', () => {
  it('returns bar ', () => {
    expect(foo()).toEqual('bar + baz')
  })
})

