import React from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { FormatNumberOptions, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import type { CssHandlesTypes } from 'vtex.css-handles'

import formatCurrency from './formatCurrency'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

// TypeScript thinks that all browsers have formatToParts
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const hasFormatToParts = !!formatter.formatToParts

const CSS_HANDLES = [
  'currencyContainer',
  'currencyCode',
  'currencyLiteral',
  'currencyInteger',
  'currencyGroup',
  'currencyDecimal',
  'currencyFraction',
  'currencyInfinity',
  'currencyMinusSign',
  'currencyNan',
  'currencyPlusSign',
  'currencyPercentSign',
] as const

const handlesMap: Record<Intl.NumberFormatPartTypes, string> = {
  currency: 'currencyCode',
  literal: 'currencyLiteral',
  integer: 'currencyInteger',
  group: 'currencyGroup',
  decimal: 'currencyDecimal',
  fraction: 'currencyFraction',
  infinity: 'currencyInfinity',
  minusSign: 'currencyMinusSign',
  nan: 'currencyNan',
  plusSign: 'currencyPlusSign',
  percentSign: 'currencyPercentSign',
}

interface Props {
  value: number
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

function FormattedCurrency({ value, classes }: Props) {
  const { culture } = useRuntime()
  const intl = useIntl()
  const { handles } = useCssHandles(CSS_HANDLES, { classes })

  // In case it's IE11
  if (!hasFormatToParts) {
    const number = formatCurrency({ intl, culture, value })

    return <span className={handles.currencyContainer}>{number}</span>
  }

  /**
 * The default "es" currency format is not following the normal conventions of comma separators
 * The comma separator should be each 3 integers ($1,876.00)
 * This validation ensures that the issue on "es" currency locale by UNICODE has a workarround
 * https://unicode-org.atlassian.net/browse/CLDR-13762
 * https://unicode-org.atlassian.net/projects/CLDR/issues/CLDR-13265?filter=allissues&orderby=created%20DESC&keyword=spanish
 */
  if (culture.language == 'es') {
    const number = formatCurrency({ intl, culture, value })

    return <span className={handles.currencyContainer}>{number}</span>
  }

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
  const isRomanian =
    culture.currency === 'RON' && intl.locale.indexOf('ro') === 0

  if (isRomanian) {
    formatOptions.currencyDisplay = 'name'
  }

  const result = intl
    .formatNumberToParts(value, formatOptions)
    .map((part, index) => {
      const handleName = handlesMap[part.type]
      // I spent 20 min here, but could not type this properly
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const handle = handles[handleName]

      if (isRomanian && part.type === 'currency') {
        return (
          <span key={index} className={handle}>
            lei
          </span>
        )
      }

      return (
        <span key={index} className={handle}>
          {part.value}
        </span>
      )
    })

  return <span className={handles.currencyContainer}>{result}</span>
}

export default FormattedCurrency
