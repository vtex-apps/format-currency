import { IntlShape, FormatNumberOptions } from 'react-intl'
import Format from './utils'

interface FormatCurrencyParams {
  intl: IntlShape
  value: number
  culture: {
    currency: string
    customCurrencyDecimalDigits?: number | null
    customCurrencySymbol?: string | null
    language: string | null
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

  /**
   * The default "es" currency format is not following the normal conventions of comma separators
   * The comma separator should be each 3 integers ($1,876.00)
   * This validation ensures that the issue on "es" currency locale by UNICODE has a workarround
   * https://unicode-org.atlassian.net/browse/CLDR-13762
   * https://unicode-org.atlassian.net/projects/CLDR/issues/CLDR-13265?filter=allissues&orderby=created%20DESC&keyword=spanish
   */
  if (culture.language == 'es') {
    let props = {
      prefix: culture.customCurrencySymbol ?? undefined,
      decimalScale: culture.customCurrencyDecimalDigits ?? undefined
    }

    if (!props.prefix) delete props.prefix
    if (!props.decimalScale) delete props.decimalScale

    return new Format(props).currency(`${value}`)
  }

  /**
   * The default Romanian currency format is wrong
   * https://stackoverflow.com/questions/57526989/return-correct-currency-for-intl-numberformat-romanian-lei
   */
  if (culture.currency === 'RON' && intl.locale.indexOf('ro') === 0) {
    formatOptions.currencyDisplay = 'name'

    return intl.formatNumber(value, formatOptions).replace(' românești', '')
  }

  return intl.formatNumber(value, formatOptions)
}