import {foo} from '../../main/ts/foo'
import '@abstractest/types'

describe('with global test API', () => {
  it('foo() returns bar (async)', () => {
    expect(foo()).toEqual('bar')
  })
})
