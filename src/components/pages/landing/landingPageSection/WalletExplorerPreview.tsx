'use client'

import { JSX, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  ArrowRightIcon,
  CryButton,
  CrySearchBar,
  MagnifyingGlassIcon,
  CopyIcon,
} from '@420cry/420cry-lib'
import {
  resolveSearchInputType,
  showToast,
  externalService,
  SIGN_UP_ROUTE,
} from '@/lib'
import { SearchInput, ITransactionData, ITransactionXPUB } from '@/types'

export default function WalletExplorerPreview(): JSX.Element {
  const t = useTranslations()
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<{
    type: 'transaction' | 'xpubTransaction'
    data: ITransactionData | ITransactionXPUB
  } | null>(null)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!searchTerm.trim()) {
      showToast(false, t('app.messages.error.emptyInput'))
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
    } catch (_error) {
      setSearchResult(null)
      showToast(
        false,
        _error instanceof Error ? _error.message : String(_error),
      )
    } finally {
      setIsSearching(false)
    }
  }

  const handleExampleClick = async (example: string) => {
    try {
      await navigator.clipboard.writeText(example)
      showToast(true, t('landing.walletExplorer.exampleCopied'))
      setSearchTerm(example)
    } catch (_error) {
      showToast(false, t('landing.walletExplorer.copyFailed'))
    }
  }

  const exampleSearches = [
    {
      type: t('landing.walletExplorer.transactionHash'),
      example:
        '0b145463a692b8dad410030839496b84539de3bde345d9d59fda179ee13a8690',
      description: t('landing.walletExplorer.transactionDescription'),
      shortLabel: 'TX',
    },
    {
      type: t('landing.walletExplorer.walletAddress'),
      example:
        'xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz',
      description: t('landing.walletExplorer.walletDescription'),
      shortLabel: 'WA',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20">
      <div className="absolute inset-0 neon-gradient opacity-90" aria-hidden />
      <div className="absolute inset-0 neon-grid" aria-hidden />
      <div className="absolute inset-0 grid-lines" aria-hidden />
      <div className="absolute -right-10 top-10 w-72 h-72 bg-cyan-500/30 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 text-slate-50">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 pill">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            {t('landing.walletExplorer.powerfulAnalysis')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold gradient-text break-words">
            {t('landing.walletExplorer.title')}
          </h2>
          <p className="text-lg md:text-xl text-slate-200/80 max-w-2xl mx-auto break-words">
            {t('landing.walletExplorer.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Search Interface */}
          <div className="glass-card rounded-2xl p-7 sm:p-8 border border-white/10 shadow-2xl shadow-purple-500/15">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
              <h3 className="text-2xl font-bold text-white break-words">
                {t('landing.walletExplorer.trySearch')}
              </h3>
              <span className="pill bg-white/10 border-white/10 text-xs">
                {t('landing.walletExplorer.exampleSearches')}
              </span>
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">
                  {t('landing.walletExplorer.trySearch')}
                </label>
                <CrySearchBar
                  placeholder={t('landing.walletExplorer.searchPlaceholder')}
                  width="w-full"
                  height="h-12"
                  textColor="text-white"
                  iconColor="text-slate-400"
                  rounded="rounded-xl"
                  ringColor="focus:ring-cyan-400"
                  className="text-sm bg-white/5 border border-white/15 placeholder:text-slate-400 focus:border-cyan-400/70 transition-all duration-200"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              <CryButton
                type="submit"
                color="secondary"
                disabled={isSearching}
                className="w-full py-3 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold border border-white/10"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {t('landing.walletExplorer.searching')}
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      <MagnifyingGlassIcon className="w-4 h-4" />
                      {t('landing.walletExplorer.searchButton')}
                    </div>
                  </>
                )}
              </CryButton>
            </form>

            {/* Example Searches */}
            <div className="mt-8 space-y-4">
              {exampleSearches.map((example, index) => (
                <div
                  key={index}
                  className="glass-outline rounded-xl p-4 border border-white/10 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleExampleClick(example.example)}
                  title={t('landing.walletExplorer.clickToCopy')}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-white/10 group-hover:bg-cyan-500/20 rounded-lg flex items-center justify-center transition-colors duration-200 text-xs font-semibold text-cyan-200">
                      {example.shortLabel}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-white text-sm group-hover:text-cyan-200 transition-colors duration-200">
                          {example.type}
                        </h5>
                        <CopyIcon className="w-3 h-3 text-slate-400 group-hover:text-cyan-300 transition-colors duration-200" />
                      </div>
                      <p className="text-slate-300/80 text-xs mt-1">
                        {example.description}
                      </p>
                      <code className="text-xs text-slate-200 bg-white/5 border border-white/10 group-hover:border-cyan-400/50 group-hover:text-cyan-200 px-2 py-1 rounded mt-2 block break-all transition-colors duration-200">
                        {example.example}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search Results */}
            {searchResult && (
              <div className="mt-8 glass-card rounded-xl p-6 border border-white/10 shadow-lg">
                <div className="flex items-center gap-2 mb-4 text-emerald-200">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <h4 className="font-semibold">
                    {t('landing.walletExplorer.searchResult.found')}
                  </h4>
                </div>

                {searchResult.type === 'transaction' &&
                  searchResult.data &&
                  'hash' in searchResult.data && (
                    <div className="space-y-4">
                      {/* Transaction Hash */}
                      <div className="glass-outline rounded-lg p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-slate-200/80">
                            {t(
                              'landing.walletExplorer.searchResult.transactionHash',
                            )}
                            :
                          </span>
                        </div>
                        <code className="text-xs text-cyan-100 bg-black/40 px-2 py-1 rounded break-all">
                          {searchResult.data.hash}
                        </code>
                      </div>

                      {/* Transaction Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="glass-outline rounded-lg p-3 border border-white/10">
                          <div className="text-sm font-medium text-cyan-200 mb-1">
                            {t(
                              'landing.walletExplorer.searchResult.blockHeight',
                            )}
                          </div>
                          <div className="text-lg font-semibold text-white">
                            {searchResult.data.block_height}
                          </div>
                        </div>

                        <div className="glass-outline rounded-lg p-3 border border-white/10">
                          <div className="text-sm font-medium text-fuchsia-200 mb-1">
                            {t('landing.walletExplorer.searchResult.size')}
                          </div>
                          <div className="text-lg font-semibold text-white">
                            {searchResult.data.size} bytes
                          </div>
                        </div>

                        <div className="glass-outline rounded-lg p-3 border border-white/10">
                          <div className="text-sm font-medium text-emerald-200 mb-1">
                            {t('landing.walletExplorer.searchResult.inputs')}
                          </div>
                          <div className="text-lg font-semibold text-white">
                            {searchResult.data.vin_sz}
                          </div>
                        </div>

                        <div className="glass-outline rounded-lg p-3 border border-white/10">
                          <div className="text-sm font-medium text-orange-200 mb-1">
                            {t('landing.walletExplorer.searchResult.outputs')}
                          </div>
                          <div className="text-lg font-semibold text-white">
                            {searchResult.data.vout_sz}
                          </div>
                        </div>
                      </div>

                      {/* Transaction Value */}
                      {searchResult.data.out &&
                        searchResult.data.out.length > 0 && (
                          <div className="glass-outline rounded-lg p-4 border border-white/10">
                            <div className="text-sm font-medium text-slate-200/80 mb-2">
                              {t(
                                'landing.walletExplorer.searchResult.transactionValue',
                              )}
                              :
                            </div>
                            <div className="space-y-2">
                              {searchResult.data.out.slice(0, 3).map(
                                (
                                  output: {
                                    n?: number
                                    value: number | string
                                  },
                                  index: number,
                                ) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center text-sm text-slate-200"
                                  >
                                    <span className="text-slate-300/80">
                                      {t(
                                        'landing.walletExplorer.searchResult.output',
                                      )}{' '}
                                      {output.n || index}:
                                    </span>
                                    <span className="font-semibold text-white">
                                      {(
                                        Number(output.value) / 100000000
                                      ).toFixed(8)}{' '}
                                      BTC
                                    </span>
                                  </div>
                                ),
                              )}
                              {searchResult.data.out.length > 3 && (
                                <div className="text-xs text-slate-400 text-center">
                                  ... {searchResult.data.out.length - 3}{' '}
                                  {t(
                                    'landing.walletExplorer.searchResult.moreOutputs',
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                      {/* Call to Action */}
                      <div className="glass-outline rounded-lg p-4 border border-white/10 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10">
                        <p className="text-cyan-100 text-sm mb-3">
                          {t(
                            'landing.walletExplorer.searchResult.previewDescription',
                          )}
                        </p>
                        <Link
                          href={SIGN_UP_ROUTE}
                          className="inline-flex items-center text-cyan-200 hover:text-white font-medium text-sm"
                        >
                          {t(
                            'landing.walletExplorer.searchResult.viewFullDetails',
                          )}
                          <ArrowRightIcon className="ml-1 w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  )}

                {searchResult.type === 'xpubTransaction' &&
                  searchResult.data &&
                  'found' in searchResult.data && (
                    <div className="space-y-4">
                      {/* XPUB Details */}
                      <div className="glass-outline rounded-lg p-4 border border-white/10">
                        <div className="text-sm font-medium text-slate-200/80 mb-2">
                          {t(
                            'landing.walletExplorer.searchResult.walletAddress',
                          )}
                          :
                        </div>
                        <code className="text-xs text-cyan-100 bg-black/40 px-2 py-1 rounded break-all">
                          Extended Public Key
                        </code>
                      </div>

                      {/* Wallet Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="glass-outline rounded-lg p-3 border border-white/10">
                          <div className="text-sm font-medium text-cyan-200 mb-1">
                            {t(
                              'landing.walletExplorer.searchResult.transactionsFound',
                            )}
                          </div>
                          <div className="text-lg font-semibold text-white">
                            {searchResult.data.txs?.length || 0}
                          </div>
                        </div>

                        <div className="glass-outline rounded-lg p-3 border border-white/10">
                          <div className="text-sm font-medium text-emerald-200 mb-1">
                            {t('landing.walletExplorer.searchResult.status')}
                          </div>
                          <div className="text-lg font-semibold text-white">
                            {searchResult.data.found
                              ? t(
                                  'landing.walletExplorer.searchResult.activeWallet',
                                )
                              : t('landing.walletExplorer.searchResult.noData')}
                          </div>
                        </div>
                      </div>

                      {/* Call to Action */}
                      <div className="glass-outline rounded-lg p-4 border border-white/10 bg-gradient-to-r from-emerald-500/10 to-green-500/5">
                        <p className="text-emerald-100 text-sm mb-3">
                          {t(
                            'landing.walletExplorer.searchResult.walletPreviewDescription',
                          )}
                        </p>
                        <Link
                          href={SIGN_UP_ROUTE}
                          className="inline-flex items-center text-emerald-200 hover:text-white font-medium text-sm"
                        >
                          {t(
                            'landing.walletExplorer.searchResult.viewFullDetails',
                          )}
                          <ArrowRightIcon className="ml-1 w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Features and Benefits */}
          <div className="space-y-8">
            <div className="glass-card rounded-2xl p-7 border border-white/10 shadow-xl space-y-6">
              <h3 className="text-2xl font-bold text-white">
                {t('landing.walletExplorer.powerfulAnalysis')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-outline rounded-xl p-4 border border-white/10 flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <span className="text-emerald-200 text-lg">⚡</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-white">
                      {t('landing.walletExplorer.features.realTimeData.title')}
                    </h4>
                    <p className="text-sm text-slate-200/80">
                      {t(
                        'landing.walletExplorer.features.realTimeData.description',
                      )}
                    </p>
                  </div>
                </div>

                <div className="glass-outline rounded-xl p-4 border border-white/10 flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <span className="text-cyan-200 text-lg">🔍</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-white">
                      {t(
                        'landing.walletExplorer.features.advancedSearch.title',
                      )}
                    </h4>
                    <p className="text-sm text-slate-200/80">
                      {t(
                        'landing.walletExplorer.features.advancedSearch.description',
                      )}
                    </p>
                  </div>
                </div>

                <div className="glass-outline rounded-xl p-4 border border-white/10 flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <span className="text-purple-200 text-lg">📊</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-white">
                      {t(
                        'landing.walletExplorer.features.transactionDetails.title',
                      )}
                    </h4>
                    <p className="text-sm text-slate-200/80">
                      {t(
                        'landing.walletExplorer.features.transactionDetails.description',
                      )}
                    </p>
                  </div>
                </div>

                <div className="glass-outline rounded-xl p-4 border border-white/10 flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <span className="text-orange-200 text-lg">💰</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-white">
                      {t(
                        'landing.walletExplorer.features.walletAnalytics.title',
                      )}
                    </h4>
                    <p className="text-sm text-slate-200/80">
                      {t(
                        'landing.walletExplorer.features.walletAnalytics.description',
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-white">
                  {t('landing.walletExplorer.cta.title')}
                </h4>
                <p className="text-sm text-slate-200/80">
                  {t('landing.walletExplorer.cta.description')}
                </p>
              </div>
              <Link
                href={SIGN_UP_ROUTE}
                className="btn-neon px-5 py-2 text-sm whitespace-nowrap"
              >
                {t('landing.walletExplorer.cta.button')}
                <ArrowRightIcon className="ml-1 w-3 h-3 inline-block align-middle" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
