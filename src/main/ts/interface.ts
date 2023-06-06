export type Done = (result?: any) => void

export type TestFn = (done: Done) => void | Promise<void>

export type SuiteFn = (done: Done) => void

export type Test = (name: string, fn: TestFn) => void

export type Describe = (name: string, fn: SuiteFn) => void

export type TestApi = {
  describe: Describe
  it: Test
  expect: Expect
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
