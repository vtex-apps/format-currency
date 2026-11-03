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

describe.each(CURRENCIES)('formatCurrency for %s', (currency) => {
  test.each([null, 0, 2])('customCurrencyDecimalDigits=%s', (digits) => {
    const result = formatCurrency({
      intl,
      value: 435.83,
      culture: { currency, customCurrencyDecimalDigits: digits },
    })

    // Checkout rule: the configured value is both the minimum and the maximum;
    // without one, both come from the table default (CLDR 47).
    const fixed = digits === null ? TABLE_DIGITS[currency] ?? 2 : digits

    if (fixed === 0) {
      expect(result).toMatch(/436/)
      expect(result).not.toMatch(/435/)
      expect(result).not.toMatch(/436[.,]\d/)
    } else {
      const fraction = '83'.padEnd(fixed, '0')

      expect(result).toMatch(new RegExp(`435[.,]${fraction}(?!\\d)`))
    }
  })
})

describe.each(['COP', 'BRL'])(
  'formatCurrency integer value for %s',
  (currency) => {
    test('configured 0 renders no fraction', () => {
      const result = formatCurrency({
        intl,
        value: 436,
        culture: { currency, customCurrencyDecimalDigits: 0 },
      })

      expect(result).toMatch(/436/)
      expect(result).not.toMatch(/436[.,]\d/)
    })
  }
)

describe.each(['COP', 'BRL'])(
  'formatCurrency fractional value with configured 0 for %s',
  (currency) => {
    test('rounds to whole units, like the Checkout', () => {
      const result = formatCurrency({
        intl,
        value: 435.5,
        culture: { currency, customCurrencyDecimalDigits: 0 },
      })

      expect(result).toMatch(/436/)
      expect(result).not.toMatch(/435/)
      expect(result).not.toMatch(/436[.,]\d/)
    })
  }
)

describe.each(['COP', 'BRL'])(
  'formatCurrency integer value with configured 2 for %s',
  (currency) => {
    test('always renders two fraction digits', () => {
      const result = formatCurrency({
        intl,
        value: 436,
        culture: { currency, customCurrencyDecimalDigits: 2 },
      })

      expect(result).toMatch(/436[.,]00(?!\d)/)
    })
  }
)
