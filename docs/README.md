# Format Currency

> Format currency based on the sales policy configuration.

## Usage

Add `"vtex.format-currency": "0.x"` to your dependencies.

### API

#### `FormattedCurrency`

```jsx
import React from 'react'
import { FormattedCurrency } from 'vtex.format-currency'

function Foo() {
  return <FormattedCurrency value={10} />
}
// <span class="vtex-format-currency-0-x-currencyContainer">
//   <span class="vtex-format-currency-0-x-currencyCode">$</span>
//   <span class="vtex-format-currency-0-x-currencyInteger">10<span>
//   <span class="vtex-format-currency-0-x-currencyDecimal">.</span>
//   <span class="vtex-format-currency-0-x-currencyFraction">00</span>
// </span>

export default Foo
```

:info: Do not change the symbol or hide the decimals and fraction using CSS! You can configure the currency, currency symbol and currency decimal places in the Trade Policy settings.

![image](https://user-images.githubusercontent.com/284515/94180906-1c70ba80-fe75-11ea-9cf6-e84f059d924a.png)

:warning: Since IE11 does not support the browser API `formatToParts`, in this browser it will fallback to render:

```html
<span class="vtex-format-currency-0-x-currencyContainer">$ 10.00</span>
```

#### Fraction digits

The number of fraction digits does not depend on the runtime's ICU/CLDR version. The default fraction digits of each currency come from a committed table (a CLDR 47 snapshot, `react/utils/currencyFractionDigitsTable.ts`): it lists the ISO 4217 codes whose default differs from 2, and every other code, known or unknown, uses 2, exactly as ICU does. When the Trade Policy has no configured decimal digits, minimum and maximum are both set to that default. When it has a configured value, that value is the minimum and the maximum is the larger of it and the currency default, as before; only the source of the default changed, from the runtime to the table.

To regenerate the table, run on a CLDR 47 runtime (Node 24.13.0) and compare with the committed file:

```sh
node scripts/generate-currency-fraction-digits.js > /tmp/currencyFractionDigitsTable.ts
diff -u react/utils/currencyFractionDigitsTable.ts /tmp/currencyFractionDigitsTable.ts
```

#### `formatCurrency`

```jsx
import React from 'react'
import { useIntl } from 'react-intl'
import { formatCurrency } from 'vtex.format-currency'
import { useRuntime } from 'vtex.render-runtime'

function Foo({ intl }) {
  const { culture } = useRuntime()
  const intl = useIntl()

  const value = formatCurrency({ intl, culture, value: 10 })

  return <span>{value}</span>
}
// <span>
//   $ 10.00
// </span>

export default Foo
```
