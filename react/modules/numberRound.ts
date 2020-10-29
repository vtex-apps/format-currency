export function roundUp(number: number, decimals = 2): number {
  const [, decimalPlaces] = number.toString().split('.')

  if (
    decimals > 0 &&
    decimalPlaces != null &&
    decimalPlaces.length > decimals
  ) {
    const rounding = 1 / 10 ** decimals

    return parseFloat((number + rounding).toFixed(decimals))
  }

  return number
}
