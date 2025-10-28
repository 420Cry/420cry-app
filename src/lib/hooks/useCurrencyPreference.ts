'use client'

import { useState, useEffect } from 'react'
import { CurrencyService, CurrencyCode } from '@/lib'

export function useCurrencyPreference(): {
  selectedCurrency: CurrencyCode
  changeCurrency: (currency: CurrencyCode) => void
  formatAmount: (amount: number) => string
  getSymbol: () => string
  isLoading: boolean
  availableCurrencies: CurrencyCode[]
} {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load currency preference from localStorage
    const savedCurrency = CurrencyService.getPreferredCurrency()
    setSelectedCurrency(savedCurrency)
    setIsLoading(false)
  }, [])

  const changeCurrency = (currency: CurrencyCode): void => {
    setSelectedCurrency(currency)
    CurrencyService.setPreferredCurrency(currency)
  }

  const formatAmount = (amount: number): string => {
    return CurrencyService.formatCurrency(amount, selectedCurrency)
  }

  const getSymbol = (): string => {
    return CurrencyService.getCurrencySymbol(selectedCurrency)
  }

  return {
    selectedCurrency,
    changeCurrency,
    formatAmount,
    getSymbol,
    isLoading,
    availableCurrencies: CurrencyService.getAllCurrencies(),
  }
}
