import { IntlShape, FormatNumberOptions } from 'react-intl'

interface FormatCurrencyParams {
  intl: IntlShape
  value: number
  culture: {
    language: string
    currency: string
    customCurrencyDecimalDigits?: number | null
    customCurrencySymbol?: string | null
  }
}

interface NumberParts {
  integer: string
  currency: string
  decimal: string
  fraction: string
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
   * The default "es"" currency format is not following the normal conventions of comma separators
   * The comma separator should be each 3 integers ($1,876.00)
   * This validation ensures that the issue on "es" currency locale by UNICODE has a workarround
   * https://unicode-org.atlassian.net/browse/CLDR-13762
   * https://unicode-org.atlassian.net/projects/CLDR/issues/CLDR-13265?filter=allissues&orderby=created%20DESC&keyword=spanish
   */
  if (culture.language === "es") {
    const parts = intl.formatNumberToParts(value, formatOptions)
    const numberParts: NumberParts = parts.reduce((obj, item) => ({ ...obj, [item.type]: item.value }), <NumberParts>{});

    if (numberParts.integer?.length == 4)
      return numberParts.currency + numberParts.integer.replace(/(?=(?:...)*$)/, ",") + numberParts.decimal + numberParts.fraction

    return intl.formatNumber(value, formatOptions)
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
