import { roundUp } from './numberRound'

describe('roundUp', () => {
  it("won't round a number without decimal places", () => {
    const num = 10
    const decimals = 2

    const result = roundUp(num, decimals)

    expect(result).toBe(10)
  })

  it("won't round a number with decimal places without rounding errors", () => {
    const num = 10.1
    const decimals = 2

    const result = roundUp(num, decimals)

    expect(result).toBe(10.1)

    const num2 = 10.12

    const result2 = roundUp(num2, decimals)

    expect(result2).toBe(10.12)
  })

  it("won't round if decimals are not considered (have value 0)", () => {
    const num = 10.12
    const decimals = 0

    const result = roundUp(num, decimals)

    expect(result).toBe(10.12)
  })

  it('will round if the number have more decimal places than expected', () => {
    const num2 = 10.123
    const decimals2 = 2

    const result2 = roundUp(num2, decimals2)

    expect(result2).toBe(10.13)

    const num3 = 10.1235
    const decimals3 = 3

    const result3 = roundUp(num3, decimals3)

    expect(result3).toBe(10.124)
  })
})
