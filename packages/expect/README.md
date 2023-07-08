# @abstractest/expect
> Assertion util for abstractest

## Install
```shell
yarn add @abstractest/expect
```

## Usage
```ts
import {it, describe} from 'node:test'
import {expect} from '@abstractest/expect'

describe('expect', () => {
  it('works', () => {
    expect('foo').toBe('foo')
  })
})
```

## License
[MIT](./LICENSE)
