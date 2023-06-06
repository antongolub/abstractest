import { describe, it } from 'node:test'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { run } from '../../main/ts/index'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixtures = resolve(__dirname, '../fixtures')

describe('runner', () => {
  it('runs', async () => {
    const fixture =
    await run({
      runner: 'jest',
      cwd: resolve(fixtures, 'basic-test'),
      include: ['src/test/ts/**/*']
    })
  })
})
