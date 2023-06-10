import { spawn, SuiteFn, TestApi } from '@abstractest/core'

export const _api: {
  spawn: typeof spawn
  [name: string]: any
} = {
  ...globalThis,
  spawn
}

const noop = () => {/* noop */}

const describe = Object.assign((name: string, fn?: SuiteFn) => _api.describe(name, fn), {
  only(name: string, fn?: SuiteFn) {        return _api.describe.only(name, fn) },
  skip(name: string, fn: SuiteFn = noop) {  return _api.describe.skip(name, fn) },
  todo(name: string, fn?: SuiteFn) {        return _api.it.todo(name) }, // Jest has no `describe.todo`
})

const it = Object.assign((name: string, fn?: SuiteFn) => _api.it(name, fn), {
  only(name: string, fn?: SuiteFn) {        return _api.it.only(name, fn) },
  skip(name: string, fn: SuiteFn = noop) {  return _api.it.skip(name, fn) },
  todo(name: string, fn?: SuiteFn) {        return _api.it.todo(name) },
})

export const api: TestApi = {
  it,
  describe,
  expect(value) {              return _api?.expect(value) },
  before(value) {     return _api?.beforeAll(value) },
  beforeEach(value) { return _api?.beforeEach(value) },
  after(value) {      return _api?.afterAll(value) },
  afterEach(value) {  return _api?.afterEach(value) },
}
