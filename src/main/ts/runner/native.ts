import assert from 'node:assert'
import {it, describe} from 'node:test'
import {Runner} from '../interface'

const expect = (input: any) => ({
  toEqual(expected: any) {
    assert.equal(input, expected)
  }
})

export const nativeRunner: Runner = {
  name: 'native',
  run({cwd, include}) {
    return Promise.resolve(undefined)
  },
  api: {
    it,
    describe,
    expect,
  }
}
