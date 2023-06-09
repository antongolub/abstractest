#!/usr/bin/env node

const esbuild = require('esbuild')
const { nodeExternalsPlugin } = require('esbuild-node-externals')
const minimist = require("minimist")
const glob = require('fast-glob')

const {entry, external} = minimist(process.argv.slice(2), {
  default: {
    entry: './src/main/ts/index.ts'
  }
})
const {argv} = process
const bundle = !argv.includes('--no-bundle')

const esmConfig = {
  entryPoints: entry.split(':').map(e => e.includes('*') ? glob.sync(e, {absolute: false, onlyFiles: true}) : e).flat(1),
  outdir: './target/esm',
  bundle,
  minify: true,
  sourcemap: true,
  sourcesContent: false,
  platform: 'node',
  target: 'esnext',
  format: 'esm',
  outExtension: {
    '.js': '.mjs'
  },
  external: bundle ? (external ? external.split(',') : ['node:*']) : undefined,  // https://github.com/evanw/esbuild/issues/1466
  plugins: [nodeExternalsPlugin()],           // https://github.com/evanw/esbuild/issues/619
  tsconfig: './tsconfig.json',
}

const cjsConfig = {
  ...esmConfig,
  outdir: './target/cjs',
  target: 'es6',
  format: 'cjs',
  outExtension: {
    '.js': '.cjs'
  }
}

const config = argv.includes('--cjs')
  ? cjsConfig
  : esmConfig

esbuild
  .build(config)
  .catch(() => process.exit(1))
