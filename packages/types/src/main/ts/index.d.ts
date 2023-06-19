// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/test.d.ts

import {FunctionLike, Mock, SpyOn, UnknownFunction} from './mock'
import {Describe, Expect, Hook, It, Mocker} from '@abstractest/types'

declare module '@abstractest/types' {
  export type Done = (result?: any) => void

  export type TestFn = (done: Done) => void | Promise<void>

  export type Test = (name: string, fn?: TestFn) => void

  export type It = Test & {
    only: Test
    skip: Test
    todo: Test
  }

  export type SuiteFn = (done: Done) => void

  export type DescribeSuite = (name: string, fn?: SuiteFn) => void

  export type Describe = DescribeSuite & {
    only: DescribeSuite
    skip: DescribeSuite
    todo: DescribeSuite
  }

  export type HookFn = (done: Done) => any

  export type Hook = (fn: HookFn) => void | Promise<void>

  export type TestApi = {
    describe: Describe
    it: It,
    expect: Expect
    before: Hook
    beforeEach: Hook
    after: Hook
    afterEach: Hook
    mock: Mocker
  }

  export type Run = (opts: {cwd: string, include: string[]}) => Promise<any>

  export type Runner = {
    name: string
    run: Run
    api: TestApi
  }

  export type Expect = (val: any) => {
    toEqual(val: any): void
    toHaveBeenCalled(): void
    toHaveBeenCalledTimes(n: number): void
  }

  export type Mocker = {
    fn<T extends FunctionLike = UnknownFunction>(implementation?: T): Mock<T>
    spyOn: SpyOn
  }
}

declare global {
  const it: It
  const describe: Describe
  const expect: Expect
  const before: Hook
  const beforeEach: Hook
  const after: Hook
  const afterEach: Hook
  const mock: Mocker
}
