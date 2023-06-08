import path from 'node:path'
import fs from 'node:fs/promises'
import {createRequire} from 'node:module'
import {Runner, spawn} from 'abstractest'

const r = (() => require || createRequire(import.meta.url))()

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
    const jestConfigPath = path.resolve(cwd, `jest-${Math.random().toString(36).slice(2)}.config.json`) // temporaryFile({name: 'jest.config.json'})
    await fs.writeFile(jestConfigPath, JSON.stringify({
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
      const {stdout, stderr} = await api.spawn('node', [
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
