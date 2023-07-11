# @abstractest/localstorage
> Localstorage fake API implementation

## Usage
```ts
import {init} from '@abstractest/localstorage'

init()
const { localStorage } = globalThis || window

localStorage.setItem('foo', 'bar')
localStorage.getItem('foo')
```

Mockify the instance if necessary:
```ts
import {mock} from '@abstractest/mock'
import {init, destroy} from '@abstractest/localstorage'

init(mock) // or jest
localStorage.setItem('foo', 'bar')
localStorage.setItem.calls // invocation data

destroy()
// localStorage === undefined
```

## License
[MIT](./LICENSE)
