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
<<<<<<< HEAD
=======
    const parts = intl.formatNumberToParts(value, formatOptions)
    const numberParts: NumberParts = parts.reduce((obj, item) => ({ ...obj, [item.type]: item.value }), <NumberParts>{});
>>>>>>> fafcef797152a72ce98e878fcbbd0894e7bafcf7

    console.log(formatOptions);


    // Validate if the current value is the exact length for the UNICODE issue to be present
    if (value.toFixed(2).length === 7) {
      const parts = intl.formatNumberToParts(value, formatOptions)
      const numberParts: NumberParts = parts.reduce((obj, item) => ({ ...obj, [item.type]: item.value }), <NumberParts>{});

      //Get the group separator for current locale
      const groupSeparator: string = intl.formatNumberToParts(12345678, formatOptions).filter(item => item.type === "group").pop()?.value || ""

      const currency = [
        ['es-AR', 'Argentina', 'ARS'],
        ['es-BO', 'Bolivia', 'BOB'],
        ['es-CL', 'Chile', 'CLP'],
        ['es-CO', 'Colombia', 'COP'],
        ['es-CR', 'Costa Rica', 'CRC'],
        ['es-DO', 'República Dominicana', 'DOP'],
        ['es-EC', 'Ecuador', 'USD'],
        ['es-ES', 'España', 'EUR'],
        ['es-GT', 'Guatemala', 'GTQ'],
        ['es-HN', 'Honduras', 'HNL'],
        ['es-MX', 'México', 'MXN'],
        ['es-NI', 'Nicaragua', 'NIO'],
        ['es-PA', 'Panamá', 'USD'],
        ['es-PE', 'Perú', 'PEN'],
        ['es-PR', 'Puerto Rico', 'USD'],
        ['es-PY', 'Paraguay', 'PYG'],
        ['es-SV', 'El Salvador', 'SVC'],
        ['es-US', 'Estados Unidos', 'USD'],
        ['es-UY', 'Uruguay', 'UYU'],
        ['es-VE', 'Venezuela', 'VES']
      ]

      const result = numberParts?.currency + numberParts?.integer.replace(/(?=(?:...)*$)/, groupSeparator) + (numberParts?.decimal || '') + (numberParts?.fraction || '')

      currency.map(i => {
        console.log(intl.locale);
        intl.locale = i[0]
        console.log(JSON.stringify({ country: i[1], currency: i[2], notFormated: intl.formatNumber(value, { currency: i[2], style: "currency" }), formated: result }))
      })

      return result
    }

    // Escape with current validation for biger numbers
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
