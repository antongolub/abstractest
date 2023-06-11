#!/usr/bin/env node

import {run} from '@abstractest/core'
import minimist from 'minimist'
import {createRequire} from 'node:module'

const camelize = (s: string) => s.replace(/-./g, x => x[1].toUpperCase())
const normalizeFlags = (flags = {}): Record<string, any> => Object.entries(flags).reduce((acc, [k, v]) => ({...acc, [camelize(k)]: v}), {})

const {_, cwd, runner, help, version, injectGlobal} = normalizeFlags(minimist(process.argv.slice(2), {
  alias: {
    help: ['h'],
    version: ['v'],
    'inject-global': ['inject-globals']
  },
  boolean: ['inject-global']
}));

(() => {

if (help) {
  console.log(`
  Usage:
    $ abstractest <pattern>
  
  Options:
    --runner        Specify test runner: jest, native. Defaults to void
    --help, -h      Print help digest
    --version, -v   Print version
  
  Examples:
    $ abstractest --runner=jest src/test/**/*.js
`)
  return
}

if (version) {
  console.log((import.meta.url ? createRequire(import.meta.url) : require)('../../package.json').version)
  return
}

run({
  cwd,
  include: _,
  runner,
  injectGlobal,
})

})()

