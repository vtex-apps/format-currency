import React, { FC, Fragment } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useIntl } from 'react-intl'
import formatCurrency from './formatCurrency'

const FormattedCurrency: FC<FormattedCurrencyProps> = ({
  value,
}) => {
  const { culture } = useRuntime()
  const intl = useIntl()

  const number = formatCurrency({ intl, culture, value })

  return (
    <Fragment>
      {number}
    </Fragment>
  )
}

interface FormattedCurrencyProps {
  value: number
}

export default FormattedCurrency
