import {
  CURRENCY_FRACTION_DIGITS_EXCEPTIONS,
  DEFAULT_CURRENCY_FRACTION_DIGITS,
  getCurrencyFractionOptions,
  getDefaultCurrencyFractionDigits,
} from '../utils/currencyFractionDigits'

describe('getCurrencyFractionOptions', () => {
  it('custom digits are the minimum, max is the larger of it and the default', () => {
    expect(
      getCurrencyFractionOptions({
        currency: 'BRL',
        customCurrencyDecimalDigits: 0,
      })
    ).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 2 })

    expect(
      getCurrencyFractionOptions({
        currency: 'COP',
        customCurrencyDecimalDigits: 3,
      })
    ).toEqual({ minimumFractionDigits: 3, maximumFractionDigits: 3 })

    expect(
      getCurrencyFractionOptions({
        currency: 'RSD',
        customCurrencyDecimalDigits: 0,
      })
    ).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0 })

    expect(
      getCurrencyFractionOptions({
        currency: 'RSD',
        customCurrencyDecimalDigits: 2,
      })
    ).toEqual({ minimumFractionDigits: 2, maximumFractionDigits: 2 })

    expect(
      getCurrencyFractionOptions({
        currency: 'CLF',
        customCurrencyDecimalDigits: 2,
      })
    ).toEqual({ minimumFractionDigits: 2, maximumFractionDigits: 4 })
  })

  it('custom digits and unknown currency use the default as the max', () => {
    expect(
      getCurrencyFractionOptions({
        currency: 'XXX1',
        customCurrencyDecimalDigits: 0,
      })
    ).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 2 })
  })

  it('null digits use the table default', () => {
    expect(
      getCurrencyFractionOptions({
        currency: 'COP',
        customCurrencyDecimalDigits: null,
      })
    ).toEqual({ minimumFractionDigits: 2, maximumFractionDigits: 2 })

    expect(getCurrencyFractionOptions({ currency: 'JPY' })).toEqual({
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })

    expect(getCurrencyFractionOptions({ currency: 'CLF' })).toEqual({
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    })
  })

  it('null digits and unknown currency use the default, like ICU', () => {
    expect(
      getCurrencyFractionOptions({
        currency: 'XXX1',
        customCurrencyDecimalDigits: null,
      })
    ).toEqual({ minimumFractionDigits: 2, maximumFractionDigits: 2 })
  })

  it('lowercase currency code works', () => {
    expect(getCurrencyFractionOptions({ currency: 'bhd' })).toEqual({
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    })
  })
})

describe('getDefaultCurrencyFractionDigits', () => {
  it('is the CLDR 47 snapshot', () => {
    expect(DEFAULT_CURRENCY_FRACTION_DIGITS).toBe(2)
    expect(Object.keys(CURRENCY_FRACTION_DIGITS_EXCEPTIONS)).toHaveLength(51)

    const digits = [
      'COP',
      'HUF',
      'IDR',
      'PKR',
      'RSD',
      'BRL',
      'ARS',
      'USD',
      'MXN',
      'JPY',
      'BHD',
      'CLF',
      'UYI',
      'UYW',
    ].map((code) => [code, getDefaultCurrencyFractionDigits(code)])

    expect(digits).toEqual([
      ['COP', 2],
      ['HUF', 2],
      ['IDR', 2],
      ['PKR', 2],
      ['RSD', 0],
      ['BRL', 2],
      ['ARS', 2],
      ['USD', 2],
      ['MXN', 2],
      ['JPY', 0],
      ['BHD', 3],
      ['CLF', 4],
      ['UYI', 0],
      ['UYW', 4],
    ])
  })

  it('only lists exceptions, so default-digit currencies are not keys', () => {
    expect(CURRENCY_FRACTION_DIGITS_EXCEPTIONS).not.toHaveProperty('COP')
    expect(CURRENCY_FRACTION_DIGITS_EXCEPTIONS).not.toHaveProperty('BRL')
    expect(Object.values(CURRENCY_FRACTION_DIGITS_EXCEPTIONS)).not.toContain(2)
  })
})
