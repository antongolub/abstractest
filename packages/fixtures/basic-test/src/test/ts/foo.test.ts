import {it, describe, expect, after, afterEach, before, beforeEach} from 'abstractest'

import {foo} from '../../main/ts/foo'

describe('foo()', () => {
  let count = 0

  before(() => count++)
  beforeEach(async () => new Promise((resolve, reject) =>
    setTimeout(() => resolve(count++),10)))

  it('returns bar', (done) => {
    expect(foo()).toEqual('bar')
    expect(count).toEqual(2)
    done()
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
