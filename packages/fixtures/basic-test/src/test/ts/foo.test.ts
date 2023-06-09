import {it, describe, expect} from 'abstractest'

import {foo} from '../../main/ts/foo'

describe('foo()', () => {
  it('returns bar ', (done) => {
    expect(foo()).toEqual('bar')
    done()
  })
})

