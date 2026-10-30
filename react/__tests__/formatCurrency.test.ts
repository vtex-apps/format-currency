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

    // Mirrors the legacy rule: the configured value is the minimum and the
    // maximum is the larger of it and the table default (CLDR 47).
    const table = TABLE_DIGITS[currency] ?? 2
    const min = digits === null ? table : digits
    const max = Math.max(min, table)

    if (max === 0) {
      expect(result).toMatch(/436/)
      expect(result).not.toMatch(/435/)
      expect(result).not.toMatch(/436[.,]\d/)
    } else {
      const fraction = '83'.padEnd(min, '0')

      expect(result).toMatch(new RegExp(`435[.,]${fraction}(?!\\d)`))
    }
  })
})

describe.each(['COP', 'BRL'])(
  'formatCurrency integer value for %s',
  (currency) => {
    test('configured 0 renders no fraction (legacy: min 0)', () => {
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
