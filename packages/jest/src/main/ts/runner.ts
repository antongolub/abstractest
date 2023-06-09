import path from 'node:path'
import fs from 'node:fs/promises'
import {createRequire} from 'node:module'
import os from 'node:os'
import {Runner, spawn} from '@abstractest/core'

const r = import.meta.url ? createRequire(import.meta.url) : require

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
    }
  },
  async run({cwd, include}) {
    const jestBinPath = path.resolve(r.resolve('jest'), '../../bin/jest.js')
    // const jestSetupPath = path.resolve(await fs.realpath(os.tmpdir()), `jest-setup-${Math.random().toString(36).slice(2)}.mjs`)
    const jestConfigPath = path.resolve(await fs.realpath(os.tmpdir()), `jest-config-${Math.random().toString(36).slice(2)}.json`)
    await fs.writeFile(jestConfigPath, JSON.stringify({
      // setupFiles: [jestSetupPath],
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

    // await fs.writeFile(jestSetupPath,`import {loadRunner} from 'abstractest'; await loadRunner(process.env.ABSTRACTEST_RUNNER)`, 'utf8')

    // const options = {
    //   projects: [
    //     jestConfigPath,
    //   ],
    // }
    // const jest = (await import('jest')).default
    // return jest
    //   .runCLI(options, options.projects)
    //   .then((success: any) => {
    //     console.log('success=', success);
    //   })
    //   .catch((failure: any) => {
    //     console.error('failure=', failure);
    //   })
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
    }
  }
})
