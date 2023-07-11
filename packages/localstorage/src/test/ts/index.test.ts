import { describe, it } from 'node:test'
import * as assert from 'node:assert'
import { LocalStorage, init, destroy } from '../../main/ts'

const g: any = global

describe('init / destroy', () => {
  it('proto', () => {
    assert.equal(g.localStorage, undefined)
    assert.equal(g.sessionStorage, undefined)

    init()
    assert.ok(g.localStorage instanceof LocalStorage)
    assert.ok(g.sessionStorage instanceof LocalStorage)

    destroy()
    assert.equal(g.localStorage, undefined)
    assert.equal(g.sessionStorage, undefined)
  })
})
