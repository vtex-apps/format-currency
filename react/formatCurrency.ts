import { customFormatCurrency } from './modules/customFormatCurrency'

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
  return customFormatCurrency({
    intl,
    value,
    currencyCode: culture.currencyCode,
    customCurrencyDecimalDigits: culture.customCurrencyDecimalDigits,
    customCurrencySymbol: culture.customCurrencySymbol,
  })
}
