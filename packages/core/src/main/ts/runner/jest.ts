import path from 'node:path';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module'
import {Runner} from '../interface'
import {spawn} from './util'

export const jestRunner: Runner = ({
  name: 'jest',
  api: {
    it(name, fn) {
      // @ts-ignore
      return globalThis.it(name, fn)
    },
    describe(name, fn) {
      // @ts-ignore
      return globalThis.describe(name, fn)
    },
    expect(value) {
      // @ts-ignore
      return globalThis.expect(value)
    }
  },
  async run({cwd, include}) {
    const require = createRequire(import.meta.url)
    const jestBinPath = path.resolve(require.resolve('jest'), '../../bin/jest.js')
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
      extensionsToTreatAsEsm: ['.ts', '.tsx'],
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
      const {stdout, stderr} = await spawn('node', [
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