# Format Currency

> Format currency based on sales policy config.

## Usage

Add `"vtex.format-currency": "1.x"` to your dependencies.

### API

#### `FormattedCurrency`

```jsx
import React from 'react'
import { FormattedCurrency } from 'vtex.format-currency'

function Foo() {
  return <FormattedCurrency value={10} />
}
// <Fragment>
//   $ 10.00
// </Fragment>

export default Foo
```

#### `formatCurrency`

```jsx
import React from 'react'
import { injectIntl } from 'react-intl'
import { formatCurrency } from 'vtex.format-currency'
import { useRuntime } from 'vtex.render-runtime'

function Foo({ intl }) {
  const { culture } = useRuntime()
  const value = formatCurrency({ intl, culture, value: 10 })

  return <span>{value}</span>
}
// <span>
//   $ 10.00
// </span>

export default injectIntl(Foo)
```
