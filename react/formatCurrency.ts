import { IntlShape, FormatNumberOptions } from 'react-intl'
import CustomFormat from './typings/CustomFormat'
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
  customFormat?: CustomFormat
}

export default function formatCurrency({
  intl,
  culture,
  value,
  customFormat
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
  if (culture.language == 'es' || customFormat) {
    const newFormat: CustomFormat = {
      ...customFormat
    }

    // Get parts from intl defaults
    const parts = intl.formatNumberToParts(value * 10000, formatOptions)
    const decimal = [...parts.filter(({ type }) => type == 'decimal')].shift()?.value
    const group = [...parts.filter(({ type }) => type == 'group')].shift()?.value

    // Set Enviroment defaults
    if (!customFormat?.decimalSeparator && decimal) newFormat.decimalSeparator = decimal
    if (!customFormat?.thousandSeparator && decimal) newFormat.thousandSeparator = group
    if (!customFormat?.prefix) newFormat.prefix = culture.customCurrencySymbol
    if (!customFormat?.decimalScale) newFormat.decimalScale = culture.customCurrencyDecimalDigits

    return new Format(newFormat).currency(`${value}`)
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