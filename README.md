# abstractest
Abstract testing processor

## Hypothesis
Find out if it's possible to declare unit tests in some _generic_ notation,
and execute them by any _appropriate_ provider.

## Usage
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
Call the test runner:
```shell
npx abstractest --runner=jest src/test/js/**/*.test.js
```

## License
[MIT](./LICENSE)
