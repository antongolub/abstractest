import { describe, it } from 'node:test'
import { run } from '../../main/ts/runner'

describe('runner', () => {
  it('runs', async () => {
    await run({runner: 'jest', include: ['src/test/fixtures/basic-test.js']})
  })
})
