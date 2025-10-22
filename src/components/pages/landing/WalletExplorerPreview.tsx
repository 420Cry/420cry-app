'use client'

import { JSX, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CryButton, CrySearchBar } from '@420cry/420cry-lib'
import {
  resolveSearchInputType,
  showToast,
  externalService,
  SIGN_UP_ROUTE,
} from '@/lib'
import { SearchInput } from '@/types'

export default function WalletExplorerPreview(): JSX.Element {
  const t = useTranslations()
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<any>(null)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!searchTerm.trim()) {
      showToast(false, t('app.alertTitle.emptyInput'))
      return
    }

    const input: SearchInput = resolveSearchInputType(searchTerm)

    if (input.type === 'UNKNOWN') {
      showToast(false, t('dashboard.search.alert.invalidInput'))
      return
    }

    setIsSearching(true)

    try {
      switch (input.type) {
        case 'TXID': {
          const response =
            await externalService.walletExplorer.searchTransaction.getTransaction(
              input.txid,
            )

          if (response.isSuccess && response.data) {
            setSearchResult({ type: 'transaction', data: response.data })
            showToast(true, t(response.message))
          } else {
            setSearchResult(null)
            showToast(false, t(response.message))
          }
          break
        }

        case 'XPUB': {
          const response =
            await externalService.walletExplorer.searchTransaction.getTransactionByXPUB(
              input.xpub,
            )

          if (response.isSuccess && response.data) {
            setSearchResult({ type: 'xpubTransaction', data: response.data })
            showToast(true, t(response.message))
          } else {
            setSearchResult(null)
            showToast(false, t(response.message))
          }
          break
        }

        default:
          showToast(false, t('dashboard.search.alert.invalidInput'))
          break
      }
    } catch (error) {
      setSearchResult(null)
      showToast(false, error instanceof Error ? error.message : String(error))
    } finally {
      setIsSearching(false)
    }
  }

  const exampleSearches = [
    {
      type: t('landing.walletExplorer.transactionHash'),
      example:
        '0b145463a692b8dad410030839496b84539de3bde345d9d59fda179ee13a8690',
      description: t('landing.walletExplorer.transactionDescription'),
    },
    {
      type: t('landing.walletExplorer.walletAddress'),
      example:
        'xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz',
      description: t('landing.walletExplorer.walletDescription'),
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('landing.walletExplorer.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('landing.walletExplorer.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Search Interface */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {t('landing.walletExplorer.trySearch')}
            </h3>

            <form onSubmit={handleSearchSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('landing.walletExplorer.trySearch')}
                </label>
                <CrySearchBar
                  placeholder={t('landing.walletExplorer.searchPlaceholder')}
                  width="w-full"
                  height="h-12"
                  textColor="text-gray-900"
                  iconColor="text-gray-400"
                  rounded="rounded-lg"
                  ringColor="focus:ring-blue-500"
                  className="text-sm bg-white border border-gray-300 placeholder-gray-500 focus:border-blue-500 transition-all duration-200"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              <CryButton
                type="submit"
                disabled={isSearching}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {t('landing.walletExplorer.searching')}
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    {t('landing.walletExplorer.searchButton')}
                  </>
                )}
              </CryButton>
            </form>

            {/* Example Searches */}
            <div className="mt-8 space-y-4">
              <h4 className="font-semibold text-gray-900">
                {t('landing.walletExplorer.exampleSearches')}
              </h4>
              {exampleSearches.map((example, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">
                        {example.type === 'Transaction Hash' ? 'TX' : 'WA'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900 text-sm">
                        {example.type}
                      </h5>
                      <p className="text-gray-600 text-xs mt-1">
                        {example.description}
                      </p>
                      <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-2 block break-all">
                        {example.example}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search Results */}
            {searchResult && (
              <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <h4 className="font-semibold text-gray-900">
                    {t('landing.walletExplorer.searchResult.found')}
                  </h4>
                </div>

                {searchResult.type === 'transaction' && searchResult.data && (
                  <div className="space-y-4">
                    {/* Transaction Hash */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          {t(
                            'landing.walletExplorer.searchResult.transactionHash',
                          )}
                          :
                        </span>
                      </div>
                      <code className="text-xs text-gray-800 bg-gray-100 px-2 py-1 rounded break-all">
                        {searchResult.data.hash}
                      </code>
                    </div>

                    {/* Transaction Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-blue-800 mb-1">
                          {t('landing.walletExplorer.searchResult.blockHeight')}
                        </div>
                        <div className="text-lg font-semibold text-blue-900">
                          {searchResult.data.block_height}
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-purple-800 mb-1">
                          {t('landing.walletExplorer.searchResult.size')}
                        </div>
                        <div className="text-lg font-semibold text-purple-900">
                          {searchResult.data.size} bytes
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-green-800 mb-1">
                          {t('landing.walletExplorer.searchResult.inputs')}
                        </div>
                        <div className="text-lg font-semibold text-green-900">
                          {searchResult.data.vin_sz}
                        </div>
                      </div>

                      <div className="bg-orange-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-orange-800 mb-1">
                          {t('landing.walletExplorer.searchResult.outputs')}
                        </div>
                        <div className="text-lg font-semibold text-orange-900">
                          {searchResult.data.vout_sz}
                        </div>
                      </div>
                    </div>

                    {/* Transaction Value */}
                    {searchResult.data.out &&
                      searchResult.data.out.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm font-medium text-gray-600 mb-2">
                            {t(
                              'landing.walletExplorer.searchResult.transactionValue',
                            )}
                            :
                          </div>
                          <div className="space-y-2">
                            {searchResult.data.out
                              .slice(0, 3)
                              .map((output: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center text-sm"
                                >
                                  <span className="text-gray-600">
                                    {t(
                                      'landing.walletExplorer.searchResult.output',
                                    )}{' '}
                                    {output.n || index}:
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {(output.value / 100000000).toFixed(8)} BTC
                                  </span>
                                </div>
                              ))}
                            {searchResult.data.out.length > 3 && (
                              <div className="text-xs text-gray-500 text-center">
                                ... and {searchResult.data.out.length - 3}{' '}
                                {t(
                                  'landing.walletExplorer.searchResult.moreOutputs',
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Call to Action */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-blue-700 text-sm mb-3">
                        {t(
                          'landing.walletExplorer.searchResult.previewDescription',
                        )}
                      </p>
                      <a
                        href="/auth/signup"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        {t(
                          'landing.walletExplorer.searchResult.viewFullDetails',
                        )}
                        <svg
                          className="ml-1 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}

                {searchResult.type === 'xpubTransaction' &&
                  searchResult.data && (
                    <div className="space-y-4">
                      {/* XPUB Details */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-600 mb-2">
                          {t(
                            'landing.walletExplorer.searchResult.walletAddress',
                          )}
                          :
                        </div>
                        <code className="text-xs text-gray-800 bg-gray-100 px-2 py-1 rounded break-all">
                          {searchResult.data.xpub || 'Extended Public Key'}
                        </code>
                      </div>

                      {/* Wallet Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="text-sm font-medium text-blue-800 mb-1">
                            {t(
                              'landing.walletExplorer.searchResult.transactionsFound',
                            )}
                          </div>
                          <div className="text-lg font-semibold text-blue-900">
                            {searchResult.data.transactions?.length || 0}
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="text-sm font-medium text-green-800 mb-1">
                            {t('landing.walletExplorer.searchResult.status')}
                          </div>
                          <div className="text-lg font-semibold text-green-900">
                            {searchResult.data.found
                              ? t(
                                  'landing.walletExplorer.searchResult.activeWallet',
                                )
                              : t('landing.walletExplorer.searchResult.noData')}
                          </div>
                        </div>
                      </div>

                      {/* Call to Action */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                        <p className="text-green-700 text-sm mb-3">
                          {t(
                            'landing.walletExplorer.searchResult.walletPreviewDescription',
                          )}
                        </p>
                        <a
                          href="/auth/signup"
                          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          {t(
                            'landing.walletExplorer.searchResult.viewFullDetails',
                          )}
                          <svg
                            className="ml-1 w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Features and Benefits */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('landing.walletExplorer.powerfulAnalysis')}
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">⚡</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t('landing.walletExplorer.features.realTimeData.title')}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {t(
                        'landing.walletExplorer.features.realTimeData.description',
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">🔍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t(
                        'landing.walletExplorer.features.advancedSearch.title',
                      )}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {t(
                        'landing.walletExplorer.features.advancedSearch.description',
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-xl">📊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t(
                        'landing.walletExplorer.features.transactionDetails.title',
                      )}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {t(
                        'landing.walletExplorer.features.transactionDetails.description',
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-xl">💰</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t(
                        'landing.walletExplorer.features.walletAnalytics.title',
                      )}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {t(
                        'landing.walletExplorer.features.walletAnalytics.description',
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">
                {t('landing.walletExplorer.cta.title')}
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                {t('landing.walletExplorer.cta.description')}
              </p>
              <a
                href={SIGN_UP_ROUTE}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                {t('landing.walletExplorer.cta.button')}
                <svg
                  className="ml-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
