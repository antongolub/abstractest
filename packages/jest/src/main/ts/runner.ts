import path from 'node:path'
import fs from 'node:fs/promises'
import os from 'node:os'
import {Runner, r} from '@abstractest/core'
import {api, _api} from './adapter'

export const runner: Runner = ({
  name: 'jest',
  api,
  async run({cwd, include}) {
    const {
      jestBinPath,
      jestSetupPath,
      jestConfigPath
    } = await touchJest(cwd, include)

    try {
      await _api.spawn('node', [
        '--experimental-specifier-resolution=node',
        '--experimental-vm-modules',
        jestBinPath,
        '--config',
        jestConfigPath
      ], {
        cwd,
        env: process.env,
      })
    } finally {
      await fs.unlink(jestConfigPath)
      await fs.unlink(jestSetupPath)
    }
  }
})

const touchJest = async (cwd: string, include: string[]) => {
  const tmp = await fs.mkdir(path.resolve(await fs.realpath(os.tmpdir()), Math.random().toString(36).slice(2)), {recursive: true}) + ''
  const abstractestPath = r.resolve('@abstractest/core')
  const jestBinPath = path.resolve(r.resolve('jest'), '../../bin/jest.js')
  const jestSetupPath = path.resolve(tmp, `jest-setup.mjs`)
  const jestConfigPath = path.resolve(tmp, `jest-config.json`)
  const tsJestPath = path.resolve(r.resolve('ts-jest'), '../..')
  const script = `import {init} from '${abstractestPath}'; await init()`

  await fs.writeFile(jestConfigPath, JSON.stringify({
    moduleNameMapper: {
      '^@abstractest/core$': abstractestPath
    },
    setupFilesAfterEnv: [jestSetupPath],
    rootDir: cwd,
    preset: tsJestPath,
    transform: {
      '^.+\\.tsx?$': [tsJestPath, {useESM: true}]
    },
    moduleFileExtensions: [
      'ts',
      'tsx',
      'js',
      'jsx',
      'json',
      'node'
    ],
    extensionsToTreatAsEsm: ['.ts', '.tsx', '.mts'],
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: './target/coverage',
    collectCoverageFrom: [
      'src/main/**/*.ts'
    ],
    testMatch: include.map(item => `${cwd}/${item}`),
    testTimeout: 2000,
  }))

  await fs.writeFile(jestSetupPath, script, 'utf8')

  return {
    jestBinPath,
    jestSetupPath,
    jestConfigPath,
  }
}
