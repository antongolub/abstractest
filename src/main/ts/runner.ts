import {Describe, Runner, SuiteFn, Test, TestFn} from './interface'
import {nativeRunner} from './runner/native'
import {jestRunner} from './runner/jest'
import fs from 'node:fs'
import path from 'node:path'

export const it: Test = (name: string, fn: TestFn) => {
  getRunner().api.it(name, fn)
}
export const describe: Describe = (name: string, fn: SuiteFn) => {
  getRunner().api.describe(name, fn)
}

let runner

export const getRunner = (): Runner => nativeRunner

export const run = async (opts: any = {}) => {
  const _opts = {runner: 'native'}
  // const files: string[] = await glob(opts.pattern, {onlyFiles: true, absolute: true})

  runner = opts.runner === 'jest' ? jestRunner : nativeRunner
  // console.log(runner.run(opts.include))
  await runner.run(opts.include)
  // await Promise.all(files.map(file => import(file)))
}
