import { IntlShape, FormatNumberOptions } from 'react-intl'
import withFormattedDecimals from './withFormattedDecimals'

interface FormatCurrencyParams {
  intl: IntlShape
  value: number
  culture: {
    currency: string
    customCurrencyDecimalDigits?: number | null
    customCurrencySymbol?: string | null
  }
  appSettings?: {
    currencyWithSupFormatting: boolean
  }
}

export default function formatCurrency({
  intl,
  culture,
  value,
  appSettings,
}: FormatCurrencyParams) {
  const formatOptions: FormatNumberOptions = {
    style: 'currency',
    currency: culture.currency,
  }

  if (culture.customCurrencyDecimalDigits != null) {
    formatOptions.minimumFractionDigits = culture.customCurrencyDecimalDigits
  }

  /**
   * The default Romanian currency format is wrong
   * https://stackoverflow.com/questions/57526989/return-correct-currency-for-intl-numberformat-romanian-lei
   */
  let formattedValue = undefined

  if (culture.currency === 'RON' && intl.locale.indexOf('ro') === 0) {
    formatOptions.currencyDisplay = 'name'

    formattedValue = intl
      .formatNumber(value, formatOptions)
      .replace(' românești', '')
  } else {
    formattedValue = intl.formatNumber(value, formatOptions)
  }

  return appSettings?.currencyWithSupFormatting
    ? withFormattedDecimals({ formattedValue })
    : formattedValue
}
