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
