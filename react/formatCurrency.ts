import { IntlShape, FormatNumberOptions } from 'react-intl'

import { roundUp } from './modules/numberRound'

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
  const formatOptions: FormatNumberOptions = {
    style: 'currency',
    currency: culture.currency,
  }

  if (culture.customCurrencyDecimalDigits != null) {
    formatOptions.minimumFractionDigits = culture.customCurrencyDecimalDigits
  }

  const roundedValue = roundUp(value, culture.customCurrencyDecimalDigits ?? 2)

  /**
   * The default Romanian currency format is wrong
   * https://stackoverflow.com/questions/57526989/return-correct-currency-for-intl-numberformat-romanian-lei
   */
  if (culture.currency === 'RON' && intl.locale.indexOf('ro') === 0) {
    formatOptions.currencyDisplay = 'name'

    return intl
      .formatNumber(roundedValue, formatOptions)
      .replace(' românești', '')
  }

  return intl.formatNumber(roundedValue, formatOptions)
}
