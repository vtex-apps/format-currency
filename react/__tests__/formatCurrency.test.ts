import { createIntl } from 'react-intl'

import formatCurrency from '../formatCurrency'

const intl = createIntl({ locale: 'en' })

const TABLE_DIGITS: Record<string, number> = { RSD: 0, UYI: 0, CLF: 4, UYW: 4 }

const CURRENCIES = [
  'COP',
  'HUF',
  'IDR',
  'PKR',
  'RSD',
  'BRL',
  'ARS',
  'USD',
  'MXN',
  'CLF',
  'UYI',
  'UYW',
]

// Same options as 0.4.1, on the test runtime: only the minimum is set.
const legacy = (currency: string, digits: number, value: number) =>
  intl.formatNumber(value, {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
  })

describe.each(CURRENCIES)('formatCurrency for %s', (currency) => {
  test('customCurrencyDecimalDigits=null uses the table default', () => {
    const result = formatCurrency({
      intl,
      value: 435.83,
      culture: { currency, customCurrencyDecimalDigits: null },
    })

    const fixed = TABLE_DIGITS[currency] ?? 2

    if (fixed === 0) {
      expect(result).toMatch(/436/)
      expect(result).not.toMatch(/435/)
      expect(result).not.toMatch(/436[.,]\d/)
    } else {
      const fraction = '83'.padEnd(fixed, '0')

      expect(result).toMatch(new RegExp(`435[.,]${fraction}(?!\\d)`))
    }
  })

  test.each([0, 2, 3])(
    'customCurrencyDecimalDigits=%s matches 0.4.1',
    (digits) => {
      for (const value of [435.83, 435.5, 436]) {
        const result = formatCurrency({
          intl,
          value,
          culture: { currency, customCurrencyDecimalDigits: digits },
        })

        expect(result).toBe(legacy(currency, digits, value))
      }
    }
  )
})
