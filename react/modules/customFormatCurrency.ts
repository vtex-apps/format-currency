export interface CustomFormatCurrencyParams {
  intl: ReactIntl.InjectedIntl
  value: number
  currencyCode: string
  customCurrencyDecimalDigits?: number | null
  customCurrencySymbol?: string | null
}

export function customFormatCurrency({
  intl,
  value,
  currencyCode,
  customCurrencyDecimalDigits,
  customCurrencySymbol,
}: CustomFormatCurrencyParams) {
  const number = intl.formatNumber(value, {
    style: 'currency',
    currency: currencyCode,
    ...(customCurrencyDecimalDigits != null
      ? { minimumFractionDigits: customCurrencyDecimalDigits }
      : {}),
  })

  const symbol = getCurrencySymbol({ intl, currencyCode })

  if (customCurrencySymbol) {
    return number.replace(symbol, customCurrencySymbol)
  }

  return number
}

function getCurrencySymbol({
  intl,
  currencyCode,
}: {
  intl: ReactIntl.InjectedIntl
  currencyCode: string
}) {
  const currencyValue = intl.formatNumber(12.34, {
    style: 'currency',
    currency: currencyCode,
  })

  const startOfValue = currencyValue.indexOf('1')
  const endOfValue = currencyValue.indexOf('4')

  const value = currencyValue.slice(startOfValue, endOfValue + 1)

  return currencyValue.replace(value, '').trim()
}
