import React, { FC, Fragment } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import formatCurrency from './formatCurrency'

const FormattedCurrency: FC<FormattedCurrencyProps & InjectedIntlProps> = ({
  value,
  intl,
}) => {
  const { culture } = useRuntime()

  return (
    <Fragment>
      {formatCurrency({
        intl,
        value,
        culture,
      })}
    </Fragment>
  )
}

interface FormattedCurrencyProps {
  value: number
}

export default injectIntl(FormattedCurrency)
