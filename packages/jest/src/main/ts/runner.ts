import path from 'node:path'
import fs from 'node:fs/promises'
import os from 'node:os'
import {Runner, spawn, r} from '@abstractest/core'

export const api: {
  spawn: typeof spawn
  [name: string]: any
} = {
  ...globalThis,
  spawn
}

export const runner: Runner = ({
  name: 'jest',
  api: {
    it(name, fn) {
      return api?.it(name, fn)
    },
    describe(name, fn) {
      return api?.describe(name, fn)
    },
    expect(value) {
      return api?.expect(value)
    },
    before(value) {
      return api?.beforeAll(value)
    },
    beforeEach(value) {
      return api?.beforeEach(value)
    },
    after(value) {
      return api?.afterAll(value)
    },
    afterEach(value) {
      return api?.afterEach(value)
    }
  },
  async run({cwd, include}) {
    const {
      jestBinPath,
      jestSetupPath,
      jestConfigPath
    } = await touchJest(cwd, include)

    try {
      await api.spawn('node', [
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
  const script = `process.env.ABSTRACTEST_RUNNER && await (await import('${abstractestPath}')).loadRunner(process.env.ABSTRACTEST_RUNNER)`

  await fs.writeFile(jestConfigPath, JSON.stringify({
    moduleNameMapper: {
      '^@abstractest/core$': abstractestPath
    },
    setupFilesAfterEnv: [jestSetupPath],
    rootDir: cwd,
    preset: 'ts-jest',
    transform: {
      '^.+\\.tsx?$': ['ts-jest', {useESM: true}]
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
