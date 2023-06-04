import {it, describe} from 'node:test'
import {Runner} from '../interface'

export const nativeRunner: Runner = {
  name: 'native',
  run() {},
  api: {
    it(name, fn) {
      return it(name, fn)
    },
    describe(name, fn) {
      return describe(name, fn)
    }
  }
}