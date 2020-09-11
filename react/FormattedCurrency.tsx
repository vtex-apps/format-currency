import React, { FC, Fragment } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useIntl } from 'react-intl'
import formatCurrency from './formatCurrency'

const FormattedCurrency: FC<FormattedCurrencyProps> = ({ value }) => {
  const { culture, getSettings } = useRuntime()
  const appSettings: {
    currencyWithSupFormatting: boolean
  } = getSettings('vtex.format-currency')

  const intl = useIntl()

  const number = formatCurrency({ intl, culture, value, appSettings })

  return <Fragment>{number}</Fragment>
}

interface FormattedCurrencyProps {
  value: number
}

export default FormattedCurrency
