const scope = '__ABSTRACTEST__'
const g: any = globalThis

export const context = {
  get data() {
    if (!g[scope]) {
      Object.defineProperty(g, scope, {
        enumerable: false,
        configurable: false,
        value: {
          global: {...g},
          runners: new Map()
        }
      })
    }
    return g[scope]
  },
  get runners() {
    return this.data.runners
  },
  get runner() {
    return this.data.runner
  },
  set runner(name: string) {
    this.data.runner = name
  }
}
