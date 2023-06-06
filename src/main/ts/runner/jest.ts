import path from 'node:path';
import fs from 'node:fs';
import {Runner} from '../interface'
import cp from 'node:child_process'
import {createRequire} from 'node:module'

export const jestRunner: Runner = ({
  api: {
    it(name, fn) {
      // @ts-ignore
      return globalThis.it(name, fn)
    },
    describe(name, fn) {
      // @ts-ignore
      return globalThis.describe(name, fn)
    }
  },
  async run({cwd, include}) {
    // console.log('cwd!!!', cwd)
    // @ts-ignore
    // const jest = (await import('jest')).default
    const require = createRequire(import.meta.url)
    const jestConfig = path.resolve(cwd, `jest-${Math.random().toString(36).slice(2)}.config.json`)// temporaryFile({name: 'jest.config.json'})
    fs.writeFileSync(jestConfig, JSON.stringify({
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
      coverageDirectory: './coverage',
      collectCoverageFrom: [
        'src/main/**/*.ts'
      ],
      testMatch: include.map(item => `${cwd}/${item}`),
      testTimeout: 2000,
    }))

    // const options = {
    //   projects: [
    //     jestConfig,
    //   ],
    // }

    // console.log('jestopts=', options)
    // return jest
    //   .runCLI(options, options.projects)
    //   .then((success: any) => {
    //     console.log('success=', success);
    //   })
    //   .catch((failure: any) => {
    //     console.error('failure=', failure);
    //   })

    console.log('env', process.env)

    const result = cp.spawnSync('node', [
      '--experimental-specifier-resolution=node',
      '--experimental-vm-modules',
      path.resolve(require.resolve('jest'), '../../bin/jest.js'),
      '--config',
      jestConfig
    ], {
      cwd,
      env: process.env
    })

    console.log('stdio=', result.stdout.toString(), result.stderr.toString())

    // console.log(global)
  }
})