import glob from 'fast-glob'

const suites = await glob('src/test/{js,ts}/*.test.{ts,cjs,mjs}', {cwd: process.cwd(), absolute: true, onlyFiles: true})

console.log('suites', suites)
await Promise.all(suites.map(suite => import(suite)))
