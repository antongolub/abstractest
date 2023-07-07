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

  interface Asserters {
    toBe(value: any): void
    toHaveBeenCalled(): void
    toHaveBeenCalledTimes(count: number): void
    toHaveBeenCalledWith(...args: any[]): void
    toHaveBeenLastCalledWith(...args: any[]): void
    toHaveBeenNthCalledWith(index: number, ...args: any[]): void
    toHaveReturned(): void
    toHaveReturnedTimes(value: number): void
    toHaveReturnedWith(value: any): void
    toHaveLastReturnedWith(value: any): void
    toHaveNthReturnedWith(nthCall: number, value: any): void
    toHaveLength(len: number): void
    toHaveProperty(key: string, value?: any): void
    toBeCloseTo(value: number, numDigits?: number): void
    toBeDefined(): void
    toBeFalsy(): void
    toBeGreaterThan(value: number | bigint): void
    toBeGreaterThanOrEqual(value: number | bigint): void
    toBeLessThan(value: number | bigint): void
    toBeLessThanOrEqual(value: number | bigint): void
    toBeInstanceOf(constructor: any): void
    toBeNull(): void
    toBeTruthy(): void
    toBeUndefined(): void
    toBeNaN(): void
    toContain(item: any): void
    toContainEqual(item: any): void
    toEqual(value: any): void
    toMatch(value: RegExp | string): void
    toMatchObject(object: any): void
    toMatchSnapshot(propertyMatchers?: any, hint?: any): void
    toMatchInlineSnapshot(propertyMatchers?: any, inlineSnapshot?: any): void
    toStrictEqual(value: any): void
    toThrow(error?: any): void
    toThrowErrorMatchingSnapshot(hint?: any): void
    toThrowErrorMatchingInlineSnapshot(inlineSnapshot: any): void
  }

  export type Expect = {
    any(val: any): any
    anything(): any
    arrayContaining(array: any[]): any
    arrayContaining(array: any[]): any
    closeTo(num: number, numDigits?: number): any
    objectContaining(object: any): any
    stringContaining(string: string): any
    stringMatching(value: string | RegExp): any
    not: {
      objectContaining(object: any): any
      stringContaining(string: string): any
      stringMatching(value: string | RegExp): any
    }
    (val: any): Asserters & {not: Asserters}
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
