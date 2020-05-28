import { IntlShape } from 'react-intl'

interface FormatCurrencyParams {
  intl: IntlShape
  value: number
  culture: {
    currency: string
    customCurrencyDecimalDigits?: number | null
    customCurrencySymbol?: string | null
  }
}

export default function formatCurrency({
  intl,
  culture,
  value,
}: FormatCurrencyParams) {
  /**
   * The default Romanian currency format is wrong
   * https://stackoverflow.com/questions/57526989/return-correct-currency-for-intl-numberformat-romanian-lei
  */
  if (culture.currency === 'RON' && intl.locale.indexOf('ro') === 0) {
    return intl.formatNumber(value, {
      style: 'currency',
      currency: culture.currency,
      currencyDisplay: 'name',
      ...(culture.customCurrencyDecimalDigits != null
        ? { minimumFractionDigits: culture.customCurrencyDecimalDigits }
        : {}),
    }).replace(' românești', '')
  }

  return intl.formatNumber(value, {
    style: 'currency',
    currency: culture.currency,
    ...(culture.customCurrencyDecimalDigits != null
      ? { minimumFractionDigits: culture.customCurrencyDecimalDigits }
      : {}),
  })
}
