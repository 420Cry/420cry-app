'use client'

import { JSX, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowRightIcon } from '@420cry/420cry-lib'
import { externalService, SIGN_UP_ROUTE } from '@/lib'
import { IFearAndGreedIndexData } from '@/types'

export default function FearAndGreedPreview(): JSX.Element {
  const t = useTranslations()
  const [data, setData] = useState<IFearAndGreedIndexData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =
          await externalService.indicator.fearAndGreed.getFearAndGreedIndextLatest()
        if (response.isSuccess && response.data) {
          setData(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch fear and greed data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getSentimentColor = (value: number) => {
    if (value <= 20) return 'text-red-400'
    if (value <= 40) return 'text-orange-400'
    if (value <= 60) return 'text-yellow-400'
    if (value <= 80) return 'text-green-400'
    return 'text-emerald-400'
  }

  const getSentimentBg = (value: number) => {
    if (value <= 20) return 'bg-red-500/20'
    if (value <= 40) return 'bg-orange-500/20'
    if (value <= 60) return 'bg-yellow-500/20'
    if (value <= 80) return 'bg-green-500/20'
    return 'bg-emerald-500/20'
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('landing.fearAndGreed.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('landing.fearAndGreed.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Preview Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('landing.fearAndGreed.currentSentiment')}
              </h3>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : data ? (
                <div className="space-y-6">
                  {/* Gauge Preview */}
                  <div className="relative w-48 h-24 mx-auto">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`text-6xl font-bold ${getSentimentColor(data.data.value)}`}
                      >
                        {data.data.value}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                      <div
                        className={`px-4 py-2 rounded-full ${getSentimentBg(data.data.value)}`}
                      >
                        <span
                          className={`text-sm font-semibold ${getSentimentColor(data.data.value)}`}
                        >
                          {data.data.value_classification}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('landing.fearAndGreed.description')}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-600">
                        {t('landing.fearAndGreed.features.realTimeUpdates')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-600">
                        {t('landing.fearAndGreed.features.historicalAnalysis')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-600">
                        {t('landing.fearAndGreed.features.marketInsights')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-gray-600">
                        {t('landing.fearAndGreed.features.tradingSignals')}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">Unable to load market data</div>
              )}
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {t('landing.fearAndGreed.whyMonitor')}
              </h3>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">📈</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t(
                        'landing.fearAndGreed.benefits.contrarianOpportunities.title',
                      )}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {t(
                        'landing.fearAndGreed.benefits.contrarianOpportunities.description',
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t('landing.fearAndGreed.benefits.riskManagement.title')}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {t(
                        'landing.fearAndGreed.benefits.riskManagement.description',
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
                        'landing.fearAndGreed.benefits.dataDrivenDecisions.title',
                      )}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {t(
                        'landing.fearAndGreed.benefits.dataDrivenDecisions.description',
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">
                {t('landing.fearAndGreed.cta.title')}
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                {t('landing.fearAndGreed.cta.description')}
              </p>
              <a
                href={SIGN_UP_ROUTE}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                {t('landing.fearAndGreed.cta.button')}
                <ArrowRightIcon className="ml-1 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
