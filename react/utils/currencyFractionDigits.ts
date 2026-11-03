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
 * A configured `customCurrencyDecimalDigits` is the minimum; the maximum is the
 * larger of the configured value and the currency default, exactly as before
 * (the legacy renderer passed only `minimumFractionDigits` and let Intl derive
 * the maximum). The difference is that the currency default now comes from the
 * committed table instead of the runtime's CLDR.
 *
 * Without a configured value, minimum and maximum both equal the default.
 * Minimum and maximum are always set together, since older engines throw a
 * RangeError when only maximumFractionDigits is given below the currency
 * default.
 */
export function getCurrencyFractionOptions(
  culture: FractionCulture
): FractionOptions {
  const { customCurrencyDecimalDigits, currency } = culture
  const digits = getDefaultCurrencyFractionDigits(currency)

  if (customCurrencyDecimalDigits != null) {
    return {
      minimumFractionDigits: customCurrencyDecimalDigits,
      maximumFractionDigits: Math.max(customCurrencyDecimalDigits, digits),
    }
  }

  return { minimumFractionDigits: digits, maximumFractionDigits: digits }
}
