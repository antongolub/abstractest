# @abstractest/core
> Abstract testing processor

## Usage
Write a test:
```ts
// src/test/js/foo.test.js

import { describe, it, expect } from '@abstractest/core'

describe('foo()', () => {
  it('works as expected', () => {
    expect(foo()).toEqual('bar')
  })
})
```
Run tests via the required runner:
```ts
import {run} from '@abstractest/core'

await run({
  cwd: process.cwd(),
  include: ['src/test/ts/**/*'],
  runner: 'native'
})
```

## License
[MIT](./LICENSE)
