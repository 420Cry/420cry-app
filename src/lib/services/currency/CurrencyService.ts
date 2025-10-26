export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'JPY'
  | 'CAD'
  | 'AUD'
  | 'CHF'
  | 'CNY'
  | 'KRW'
  | 'INR'
  | 'BRL'
  | 'RUB'
  | 'MXN'
  | 'SGD'
  | 'HKD'
  | 'NOK'
  | 'SEK'
  | 'DKK'
  | 'PLN'
  | 'CZK'
  | 'HUF'
  | 'ILS'
  | 'TRY'
  | 'ZAR'
  | 'THB'
  | 'MYR'
  | 'PHP'
  | 'IDR'
  | 'VND'

export interface CurrencyPreference {
  currency: CurrencyCode
}

export class CurrencyService {
  private static readonly CURRENCY_STORAGE_KEY = 'crypto_tracker_currency'
  private static readonly DEFAULT_CURRENCY: CurrencyCode = 'USD'

  /**
   * Get the user's preferred currency from localStorage
   */
  public static getPreferredCurrency(): CurrencyCode {
    if (typeof window === 'undefined') {
      return this.DEFAULT_CURRENCY
    }

    try {
      const stored = localStorage.getItem(this.CURRENCY_STORAGE_KEY)
      if (stored && this.isValidCurrency(stored as CurrencyCode)) {
        return stored as CurrencyCode
      }
    } catch (error) {
      console.warn(
        'Failed to read currency preference from localStorage:',
        error,
      )
    }

    return this.DEFAULT_CURRENCY
  }

  /**
   * Set the user's preferred currency in localStorage
   */
  public static setPreferredCurrency(currency: CurrencyCode): boolean {
    if (typeof window === 'undefined') {
      return false
    }

    try {
      if (this.isValidCurrency(currency)) {
        localStorage.setItem(this.CURRENCY_STORAGE_KEY, currency)
        return true
      }
    } catch (error) {
      console.warn('Failed to save currency preference to localStorage:', error)
    }

    return false
  }

  /**
   * Get currency symbol for display
   */
  public static getCurrencySymbol(currency: CurrencyCode): string {
    const symbols: Record<CurrencyCode, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CAD: 'C$',
      AUD: 'A$',
      CHF: 'CHF',
      CNY: '¥',
      KRW: '₩',
      INR: '₹',
      BRL: 'R$',
      RUB: '₽',
      MXN: '$',
      SGD: 'S$',
      HKD: 'HK$',
      NOK: 'kr',
      SEK: 'kr',
      DKK: 'kr',
      PLN: 'zł',
      CZK: 'Kč',
      HUF: 'Ft',
      ILS: '₪',
      TRY: '₺',
      ZAR: 'R',
      THB: '฿',
      MYR: 'RM',
      PHP: '₱',
      IDR: 'Rp',
      VND: '₫',
    }
    return symbols[currency] || currency
  }

  /**
   * Get all available currencies
   */
  public static getAllCurrencies(): CurrencyCode[] {
    return [
      'USD',
      'EUR',
      'GBP',
      'JPY',
      'CAD',
      'AUD',
      'CHF',
      'CNY',
      'KRW',
      'INR',
      'BRL',
      'RUB',
      'MXN',
      'SGD',
      'HKD',
      'NOK',
      'SEK',
      'DKK',
      'PLN',
      'CZK',
      'HUF',
      'ILS',
      'TRY',
      'ZAR',
      'THB',
      'MYR',
      'PHP',
      'IDR',
      'VND',
    ]
  }

  /**
   * Format currency amount for display
   */
  public static formatCurrency(amount: number, currency: CurrencyCode): string {
    const symbol = this.getCurrencySymbol(currency)

    // For currencies that typically don't use decimals
    const noDecimalCurrencies: CurrencyCode[] = ['JPY', 'KRW', 'VND', 'IDR']

    if (noDecimalCurrencies.includes(currency)) {
      return `${symbol}${Math.round(amount).toLocaleString()}`
    }

    return `${symbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  /**
   * Validate if the currency code is supported
   */
  private static isValidCurrency(currency: string): currency is CurrencyCode {
    const validCurrencies: CurrencyCode[] = [
      'USD',
      'EUR',
      'GBP',
      'JPY',
      'CAD',
      'AUD',
      'CHF',
      'CNY',
      'KRW',
      'INR',
      'BRL',
      'RUB',
      'MXN',
      'SGD',
      'HKD',
      'NOK',
      'SEK',
      'DKK',
      'PLN',
      'CZK',
      'HUF',
      'ILS',
      'TRY',
      'ZAR',
      'THB',
      'MYR',
      'PHP',
      'IDR',
      'VND',
    ]
    return validCurrencies.includes(currency as CurrencyCode)
  }
}
