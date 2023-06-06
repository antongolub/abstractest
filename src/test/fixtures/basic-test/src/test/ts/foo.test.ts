import {it, describe} from 'abstractest'
import {foo} from '../../main/ts/foo'

describe('foo()', () => {
  it('returns bar ', () => {
    console.log(foo())
  })
})

