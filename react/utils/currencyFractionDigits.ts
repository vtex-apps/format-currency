import {
  CURRENCY_FRACTION_DIGITS_EXCEPTIONS,
  DEFAULT_CURRENCY_FRACTION_DIGITS,
} from './currencyFractionDigitsTable'

export { CURRENCY_FRACTION_DIGITS_EXCEPTIONS, DEFAULT_CURRENCY_FRACTION_DIGITS }

interface FractionCulture {
  currency: string
  customCurrencyDecimalDigits?: number | null
}

interface FractionOptions {
  minimumFractionDigits: number
  maximumFractionDigits: number
}

/**
 * Default fraction digits of a currency, from the committed CLDR 47 snapshot
 * instead of the runtime's ICU. Codes outside the exceptions table, including
 * codes ICU does not know, use the default, exactly as ICU does.
 */
export function getDefaultCurrencyFractionDigits(currency: string): number {
  const code = String(currency).toUpperCase()

  return Object.prototype.hasOwnProperty.call(
    CURRENCY_FRACTION_DIGITS_EXCEPTIONS,
    code
  )
    ? CURRENCY_FRACTION_DIGITS_EXCEPTIONS[code]
    : DEFAULT_CURRENCY_FRACTION_DIGITS
}

/**
 * Returns the fraction digit options for a culture, never depending on the
 * runtime's CLDR version.
 *
 * The number of fraction digits is fixed, as in the VTEX Checkout (which
 * formats with `value.toFixed(currencyDecimalDigits)`): a configured
 * `customCurrencyDecimalDigits` is both the minimum and the maximum, so `0`
 * always renders whole units (rounded) and `2` always renders two digits.
 * Without a configured value, minimum and maximum both equal the currency
 * default from the committed table.
 *
 * Minimum and maximum are always set together, since older engines throw a
 * RangeError when only maximumFractionDigits is given below the currency
 * default.
 */
export function getCurrencyFractionOptions(
  culture: FractionCulture
): FractionOptions {
  const { customCurrencyDecimalDigits, currency } = culture
  const digits =
    customCurrencyDecimalDigits != null
      ? customCurrencyDecimalDigits
      : getDefaultCurrencyFractionDigits(currency)

  return { minimumFractionDigits: digits, maximumFractionDigits: digits }
}
