import { dirname, resolve } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { run } from '../../main/ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixtures = resolve(__dirname, '../fixtures')

describe('runner', () => {
  it('jest', async () =>
    await run({
      runner: 'jest',
      cwd: resolve(fixtures, 'basic-test'),
      include: ['src/test/ts/**/*']
    })
  )

  it('native', async () =>
    await run({
      runner: 'native',
      cwd: resolve(fixtures, 'basic-test'),
      include: ['src/test/ts/**/*']
    })
  )
})
