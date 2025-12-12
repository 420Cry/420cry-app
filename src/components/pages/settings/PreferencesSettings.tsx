'use client'

import React, { JSX } from 'react'
import { useTranslations } from 'next-intl'
import { CryButton } from '@420cry/420cry-lib'
import {
  CurrencyService,
  CurrencyCode,
  showToast,
  useCurrencyPreference,
} from '@/lib'

export const PreferencesSettings = (): JSX.Element => {
  const t = useTranslations('settings')
  const { selectedCurrency, changeCurrency } = useCurrencyPreference()

  const handleCurrencyChange = (currency: CurrencyCode) => {
    changeCurrency(currency)
    showToast(
      true,
      `${t('preferences.currency.currentCurrency')}: ${CurrencyService.getCurrencySymbol(currency)}`,
    )
  }

  return (
    <div className="space-y-6">
      {/* Currency Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t('preferences.currency.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('preferences.currency.subtitle')}
          </p>
        </div>

        {/* Current Currency Display */}
        <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <span className="text-lg">💱</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('preferences.currency.currentCurrency')}
              </p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {CurrencyService.getCurrencySymbol(selectedCurrency)}{' '}
                {selectedCurrency}
              </p>
            </div>
          </div>
        </div>

        {/* Currency Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('preferences.currency.selectCurrency')}
          </h3>

          {/* Popular Currencies */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Popular Currencies
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'].map(
                (currency) => (
                  <CryButton
                    key={currency}
                    onClick={() =>
                      handleCurrencyChange(currency as CurrencyCode)
                    }
                    color={
                      selectedCurrency === currency ? 'primary' : 'default'
                    }
                    variant={
                      selectedCurrency === currency ? 'solid' : 'outline'
                    }
                    size="md"
                    className="p-4 min-h-[60px]"
                  >
                    <div className="text-center flex flex-col items-center justify-center h-full">
                      <div className="text-xl font-bold mb-1">
                        {CurrencyService.getCurrencySymbol(
                          currency as CurrencyCode,
                        )}
                      </div>
                      <div className="text-sm font-medium">{currency}</div>
                    </div>
                  </CryButton>
                ),
              )}
            </div>
          </div>

          {/* All Currencies */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              All Currencies
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {CurrencyService.getAllCurrencies().map((currency) => (
                <CryButton
                  key={currency}
                  onClick={() => handleCurrencyChange(currency)}
                  color={selectedCurrency === currency ? 'primary' : 'default'}
                  variant={selectedCurrency === currency ? 'solid' : 'outline'}
                  size="md"
                  className="p-4 min-h-[60px]"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {CurrencyService.getCurrencySymbol(currency)}
                    </div>
                    <div className="text-xs">{currency}</div>
                  </div>
                </CryButton>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
