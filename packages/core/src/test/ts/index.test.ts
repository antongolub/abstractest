import * as assert from 'node:assert'
import { it, describe } from 'node:test'
import { it as _it, describe as _describe, run } from '../../main/ts'

describe('index', () => {
  it('has proper exports', () => {
    assert.equal(typeof _it, 'function')
    assert.equal(typeof _describe, 'function')
    assert.equal(typeof run, 'function')
  })
})
