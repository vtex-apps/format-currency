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
  maximumFractionDigits?: number
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
 * Returns the fraction digit options for a culture.
 *
 * Without a configured `customCurrencyDecimalDigits`, minimum and maximum both
 * equal the currency default from the committed table, so the output never
 * depends on the runtime's CLDR version. The VTEX Checkout renders
 * `value.toFixed(currencyDecimalDigits)` with the digits of the Trade Policy
 * currency format, which match this default when the store keeps it.
 *
 * With a configured value, only the minimum is set, exactly as in 0.4.1: the
 * maximum stays with the runtime's currency default, so stores with a
 * configured value keep the output they have today.
 *
 * Minimum and maximum are set together in the default case, since older
 * engines throw a RangeError when only maximumFractionDigits is given below
 * the currency default.
 */
export function getCurrencyFractionOptions(
  culture: FractionCulture
): FractionOptions {
  const { customCurrencyDecimalDigits, currency } = culture

  if (customCurrencyDecimalDigits != null) {
    return { minimumFractionDigits: customCurrencyDecimalDigits }
  }

  const digits = getDefaultCurrencyFractionDigits(currency)

  return { minimumFractionDigits: digits, maximumFractionDigits: digits }
}
