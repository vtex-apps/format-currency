export const useRuntime = jest.fn(() => ({
  culture: {
    currency: 'BRL',
    customCurrencyDecimalDigits: null,
    customCurrencySymbol: null,
  },
  getSettings: () => ({}),
}))
