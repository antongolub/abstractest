# @abstractest/mock
> Mocker module for abstractest

## Install
```shell
yarn add @abstractest/mock
```

## Usage
Returns pre-initialized `jest-mock` instance.
```ts
import * as assert from 'node:assert'
import {mock} from '@abstractest/mock'

const m = mock.fn(v => v)

m.mockReturnValueOnce('foo')
assert.equal(m('bar'), 'foo')
assert.equal(m('baz'), 'baz')
assert.deepEqual(m.mock.calls, [
  ['bar'],
  ['baz'],
])
```

## License
[MIT](./LICENSE)
