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
  const { culture, getSettings } = useRuntime()
  const settings = getSettings('vtex.store')
  const intl = useIntl()
  const { handles } = useCssHandles(CSS_HANDLES, { classes })

  // In case it's IE11
  if (!hasFormatToParts) {
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

    if (
      part.type === 'currency' &&
      culture?.customCurrencySymbol &&
      settings?.enableCustomCurrencySymbol
    ) {
      return (
        <span key={index} className={handle}>
          {culture.customCurrencySymbol}
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
