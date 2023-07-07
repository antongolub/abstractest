# abstractest
[![CI](https://github.com/antongolub/abstractest/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/antongolub/abstractest/actions/workflows/ci.yaml)
[![Maintainability](https://api.codeclimate.com/v1/badges/5aae4759bc5da3c06ae0/maintainability)](https://codeclimate.com/github/antongolub/abstractest/maintainability)
> An abstract testing processor

## Hypothesis
Find out if it's possible to declare unit tests in  some [_generic_](./packages/types) notation,
and execute them via any _appropriate_ provider.

## Usage
Install:
```shell
yarn add -D abstractest @abstractest/jest
```

Write a test:
```ts
// src/test/js/foo.test.js

import { describe, it, expect } from 'abstractest'

describe('foo()', () => {
  it('works as expected', () => {
    expect(foo()).toEqual('bar')
  })
})
```
Run tests via the required runner:
```shell
abstractest --runner=jest src/test/js/**/*.test.js
```

## Contents
| Package | Description | Latest |
|---------|-------------|--------|
| [@abstractest/core](./packages/core) | abstractest core utils | [![npm (scoped)](https://img.shields.io/npm/v/@abstractest/core)](https://www.npmjs.com/package/@abstractest/core) |
| [@abstractest/expect](./packages/expect) | Assertion library for abstractest | [![npm (scoped)](https://img.shields.io/npm/v/@abstractest/expect)](https://www.npmjs.com/package/@abstractest/expect) |
| [@abstractest/fixture-basic-test](./packages/fixtures/basic-test) | Testing fixtures |  |
| [@abstractest/infra](./packages/infra) | abstractest monorepo infra assets |  |
| [@abstractest/jest](./packages/jest) | Jest runner for abstractest | [![npm (scoped)](https://img.shields.io/npm/v/@abstractest/jest)](https://www.npmjs.com/package/@abstractest/jest) |
| [@abstractest/mock](./packages/mock) | Mocker module for abstractest | [![npm (scoped)](https://img.shields.io/npm/v/@abstractest/mock)](https://www.npmjs.com/package/@abstractest/mock) |
| [@abstractest/native](./packages/native) | Native node:test runner for abstractest | [![npm (scoped)](https://img.shields.io/npm/v/@abstractest/native)](https://www.npmjs.com/package/@abstractest/native) |
| [@abstractest/types](./packages/types) | abstractest types | [![npm (scoped)](https://img.shields.io/npm/v/@abstractest/types)](https://www.npmjs.com/package/@abstractest/types) |
| [abstractest](./packages/cli) | CLI for abstractest | [![npm (scoped)](https://img.shields.io/npm/v/abstractest)](https://www.npmjs.com/package/abstractest) |

## Implementation notes
* Does not provide whole module mocking by design. It's recommended to use some kind of DI/IoC for this purpose.
* Enforces ESM usage. Declare explicit file extensions (`.cjs`, `.mjs`, `.mts`, etc) to get necessary module context or initialize the legacy CommonJS API in place.

## License
[MIT](./LICENSE)
