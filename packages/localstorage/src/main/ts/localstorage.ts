// Adapted from https://github.com/clarkbw/jest-localstorage-mock/blob/master/src/localstorage.js

import type {Mocker} from '@abstractest/types'

export class LocalStorage {
  __data: Map<string, string>

  constructor(mocker?: Mocker, data: Map<string, string> = new Map()) {
    this.__data = data
    const proto = this.constructor.prototype

    if (mocker) {
      Object.entries(Object.getOwnPropertyDescriptors(proto)).forEach(([key, {value}]: [string, PropertyDescriptor]) => {
        if (typeof value === 'function' && key !== 'constructor') {
          (this as any)[key] = mocker.fn(function (this: any,...args) {
            return proto[key].call(this, ...args)
          })
        }
      })
    }
  }
  getItem(key: string) {
    return this.__data.has(key)
      ? this.__data.get(key)
      : null
  }
  setItem(key: string, value: string) {
    this.__data.set(key, value)
  }
  removeItem(key: string) {
    this.__data.delete(key)
  }
  clear() {
    this.__data.clear()
  }
  toString() {
    return '[object Storage]'
  }
  key(idx: number): string | null {
    return [...this.__data.keys()][idx] || null
  }
  get length() {
    return this.__data.size
  }
}
