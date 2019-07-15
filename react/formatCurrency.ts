interface FormatCurrencyParams {
  intl: ReactIntl.InjectedIntl
  value: number
  culture: {
    currencyCode: string
    customCurrencyDecimalDigits?: number | null
    customCurrencySymbol?: string | null
  }
}

export default function formatCurrency({
  intl,
  culture,
  value,
}: FormatCurrencyParams) {

  return intl.formatNumber(value, {
    style: 'currency',
    currency: culture.currencyCode,
    ...(culture.customCurrencyDecimalDigits != null
      ? { minimumFractionDigits: culture.customCurrencyDecimalDigits }
      : {}),
  })
}
