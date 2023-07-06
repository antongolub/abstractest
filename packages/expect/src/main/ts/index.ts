import { expect as _expect } from 'expect'
import type {Expect} from '@abstractest/types'
import {
  toMatchSnapshot,
  toMatchInlineSnapshot,
  toThrowErrorMatchingInlineSnapshot,
  toThrowErrorMatchingSnapshot,
  addSerializer,
} from 'jest-snapshot'

// https://github.com/jestjs/jest/blob/main/packages/jest-expect/src/index.ts
_expect.extend({
  // https://github.com/facebook/jest/blob/e0b33b74b5afd738edc183858b5c34053cfc26dd/e2e/custom-inline-snapshot-matchers/__tests__/bail.test.js
  toMatchSnapshot(this: any,...args: any) {
    this.dontThrow = () => {}
    return toMatchSnapshot.apply(this, args)
  },
  toMatchInlineSnapshot(this: any,...args: any) {
    this.dontThrow = () => {}
    return toMatchInlineSnapshot.apply(this, args)
  },
  // @ts-ignore
  toThrowErrorMatchingInlineSnapshot,
  // @ts-ignore
  toThrowErrorMatchingSnapshot,
})

// @ts-ignore
_expect.addSnapshotSerializer = addSerializer

export const expect: Expect = _expect as any

export {SnapshotState} from 'jest-snapshot'
