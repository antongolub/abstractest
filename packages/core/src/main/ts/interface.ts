// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/test.d.ts

export type Done = (result?: any) => void

export type TestFn = (done: Done) => void | Promise<void>

export type SuiteFn = (done: Done) => void

export type Test = (name: string, fn: TestFn) => void

export type Describe = (name: string, fn: SuiteFn) => void

export type HookFn = (done: Done) => any

export type Hook = (fn: HookFn) => void | Promise<void>

export type TestApi = {
  describe: Describe
  it: Test
  expect: Expect
  before: Hook
  beforeEach: Hook
  after: Hook
  afterEach: Hook
}

export type Run = (opts: {cwd: string, include: string[]}) => Promise<any>

export type Runner = {
  name: string
  run: Run
  api: TestApi
}

export type Expect = (val: any) => {
  toEqual(val: any): void
}


