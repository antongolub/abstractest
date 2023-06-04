import path from 'node:path';
import fs from 'node:fs';

export const jestRunner = ({
  async run(include: string[]) {
    const cwd = process.cwd()
    // @ts-ignore
    const jest = (await import('jest')).default
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
    }))

    const options = {
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
      collectCoverage: true,
      coverageDirectory: './coverage',
      testEnvironment: 'node',
      projects: [
        jestConfig,
      ],
      collectCoverageFrom: [
        'src/main/**/*.ts'
      ],
      testMatch: include.map(item => `${cwd}/${item}`)
    }

    // console.log(jest)
    await jest
      .runCLI(options, options.projects)
      .then((success: any) => {
        console.log(success);
      })
      .catch((failure: any) => {
        console.error(failure);
      })

    // console.log(global)
  }
})