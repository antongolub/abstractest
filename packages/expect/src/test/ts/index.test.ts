import { describe, it } from 'node:test'
import { expect } from '../../main/ts'

describe('expect', () => {
  it('toEqual()', () => {
    expect(true).toEqual(true)
    expect(true).toBe(true)
  })
})
