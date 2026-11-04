import React from 'react'
import { render } from '@vtex/test-tools/react'
import { useRuntime, RuntimeContext } from 'vtex.render-runtime'

import FormattedCurrency from '../FormattedCurrency'

const mockedUseRuntime = useRuntime as jest.Mock<RuntimeContext>

test('Use currencyCode as default format', () => {
  mockedUseRuntime.mockImplementation(() => ({
    culture: {
      currency: 'USD',
      customCurrencyDecimalDigits: null,
      customCurrencySymbol: null,
    },
    getSettings: () => ({}),
  }))

  const { rerender, container } = render(<FormattedCurrency value={10} />)

  let currency = container.querySelector('.currencyCode')
  let integer = container.querySelector('.currencyInteger')
  let decimal = container.querySelector('.currencyDecimal')
  let fraction = container.querySelector('.currencyFraction')

  expect(currency?.innerHTML).toBe('$')
  expect(integer?.innerHTML).toBe('10')
  expect(decimal?.innerHTML).toBe('.')
  expect(fraction?.innerHTML).toBe('00')

  mockedUseRuntime.mockImplementation(() => ({
    culture: {
      currency: 'BRL',
      customCurrencyDecimalDigits: null,
      customCurrencySymbol: null,
    },
    getSettings: () => ({}),
  }))

  rerender(<FormattedCurrency value={10} />)

  currency = container.querySelector('.currencyCode')
  integer = container.querySelector('.currencyInteger')
  decimal = container.querySelector('.currencyDecimal')
  fraction = container.querySelector('.currencyFraction')

  expect(currency?.innerHTML).toBe('R$')
  expect(integer?.innerHTML).toBe('10')
  expect(decimal?.innerHTML).toBe('.')
  expect(fraction?.innerHTML).toBe('00')
})

test('should use custom decimal digits', () => {
  mockedUseRuntime.mockImplementation(() => ({
    culture: {
      currency: 'BRL',
      customCurrencyDecimalDigits: 0,
      customCurrencySymbol: null,
    },
    getSettings: () => ({}),
  }))

  const { container } = render(<FormattedCurrency value={10} />)

  const currency = container.querySelector('.currencyCode')
  const integer = container.querySelector('.currencyInteger')
  const decimal = container.querySelector('.currencyDecimal')
  const fraction = container.querySelector('.currencyFraction')

  expect(currency).toBeTruthy()
  expect(integer).toBeTruthy()
  expect(decimal).toBeFalsy()
  expect(fraction).toBeFalsy()
})

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

// Without a configured value, minimum and maximum come from the currency
// default (table, CLDR 47).
const TABLE_DIGITS: Record<string, number> = { RSD: 0, UYI: 0, CLF: 4, UYW: 4 }

describe.each(CURRENCIES)('fraction digits for %s', (currency) => {
  test('customCurrencyDecimalDigits=null uses the table default', () => {
    mockedUseRuntime.mockImplementation(() => ({
      culture: {
        currency,
        customCurrencyDecimalDigits: null,
        customCurrencySymbol: null,
      },
      getSettings: () => ({}),
    }))

    const { container } = render(<FormattedCurrency value={435.83} />)

    const fixed = TABLE_DIGITS[currency] ?? 2
    const integer = container.querySelector('.currencyInteger')
    const decimal = container.querySelector('.currencyDecimal')
    const fraction = container.querySelector('.currencyFraction')

    if (fixed === 0) {
      expect(integer?.innerHTML).toBe('436')
      expect(decimal).toBeFalsy()
      expect(fraction).toBeFalsy()
    } else {
      expect(integer?.innerHTML).toBe('435')
      expect(decimal).toBeTruthy()
      expect(fraction?.innerHTML).toBe('83'.padEnd(fixed, '0'))
    }
  })

  test.each([0, 2, 3])(
    'customCurrencyDecimalDigits=%s matches 0.4.1',
    (digits) => {
      mockedUseRuntime.mockImplementation(() => ({
        culture: {
          currency,
          customCurrencyDecimalDigits: digits,
          customCurrencySymbol: null,
        },
        getSettings: () => ({}),
      }))

      for (const value of [435.83, 435.5, 436]) {
        const { container, unmount } = render(
          <FormattedCurrency value={value} />
        )

        // Same options as 0.4.1, on the test runtime: only the minimum is set.
        const parts = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
          minimumFractionDigits: digits,
        }).formatToParts(value)

        const part = (type: string) => parts.find((p) => p.type === type)?.value

        expect(container.querySelector('.currencyInteger')?.innerHTML).toBe(
          part('integer')
        )
        expect(container.querySelector('.currencyFraction')?.innerHTML).toBe(
          part('fraction')
        )
        unmount()
      }
    }
  )
})
