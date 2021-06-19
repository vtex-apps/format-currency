export default interface CustomFormat {
    decimalSeparator?: string
    thousandsGroupStyle?: string
    fixedDecimalScale?: boolean
    prefix?: string | null
    suffix?: string
    allowNegative?: boolean
    allowEmptyFormatting?: boolean
    allowLeadingZeros?: boolean
    isNumericString?: boolean
    type?: string
    decimalScale?: number | null
    format?: string
    thousandSeparator?: boolean | string
    allowedDecimalSeparators?: [string?, string?]
}