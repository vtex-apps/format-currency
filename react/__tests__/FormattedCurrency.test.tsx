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

// Mirrors the legacy rule: the configured value is the minimum and the maximum
// is the larger of it and the currency default (table, CLDR 47).
const TABLE_DIGITS: Record<string, number> = { RSD: 0, UYI: 0, CLF: 4, UYW: 4 }

const expectedFor = (currency: string, digits: number | null) => {
  const table = TABLE_DIGITS[currency] ?? 2
  const min = digits === null ? table : digits
  const max = Math.max(min, table)

  return max === 0
    ? { integer: '436', fraction: undefined }
    : { integer: '435', fraction: '83'.padEnd(min, '0') }
}

describe.each(CURRENCIES)('fraction digits for %s', (currency) => {
  test.each([null, 0, 2])('customCurrencyDecimalDigits=%s', (digits) => {
    mockedUseRuntime.mockImplementation(() => ({
      culture: {
        currency,
        customCurrencyDecimalDigits: digits,
        customCurrencySymbol: null,
      },
      getSettings: () => ({}),
    }))

    const { container } = render(<FormattedCurrency value={435.83} />)

    const expected = expectedFor(currency, digits)
    const integer = container.querySelector('.currencyInteger')
    const decimal = container.querySelector('.currencyDecimal')
    const fraction = container.querySelector('.currencyFraction')

    expect(integer?.innerHTML).toBe(expected.integer)

    if (expected.fraction === undefined) {
      expect(decimal).toBeFalsy()
      expect(fraction).toBeFalsy()
    } else {
      expect(decimal).toBeTruthy()
      expect(fraction?.innerHTML).toBe(expected.fraction)
    }
  })
})

describe.each(['COP', 'BRL'])('integer value for %s', (currency) => {
  test('configured 0 renders no fraction (legacy: min 0)', () => {
    mockedUseRuntime.mockImplementation(() => ({
      culture: {
        currency,
        customCurrencyDecimalDigits: 0,
        customCurrencySymbol: null,
      },
      getSettings: () => ({}),
    }))

    const { container } = render(<FormattedCurrency value={436} />)

    expect(container.querySelector('.currencyInteger')?.innerHTML).toBe('436')
    expect(container.querySelector('.currencyDecimal')).toBeFalsy()
    expect(container.querySelector('.currencyFraction')).toBeFalsy()
  })
})
