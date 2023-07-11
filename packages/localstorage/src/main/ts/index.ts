import type {Mocker} from '@abstractest/types'
import { LocalStorage } from './localstorage'
export { LocalStorage } from './localstorage'

const w: any = globalThis || window || (global && global.window) || global

export const init = (mocker?: Mocker) => {
  const mock = mocker || w.jest
  w.localStorage = new LocalStorage(mock)
  w.sessionStorage = new LocalStorage(mock)
}

export const destroy = () => {
  delete w.sessionStorage
  delete w.localStorage
}
