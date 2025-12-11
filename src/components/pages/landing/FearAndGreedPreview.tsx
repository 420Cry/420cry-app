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
    <section className="relative overflow-hidden bg-slate-950 py-20">
      <div className="absolute inset-0 neon-gradient opacity-90" aria-hidden />
      <div className="absolute inset-0 neon-grid" aria-hidden />
      <div className="absolute -left-16 top-20 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl" />
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-cyan-500/30 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 space-y-12 text-slate-50">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 pill">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            {t('landing.hero.trustIndicators.realTimeData')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold gradient-text">
            {t('landing.fearAndGreed.title')}
          </h2>
          <p className="text-lg md:text-xl text-slate-200/80 max-w-2xl mx-auto">
            {t('landing.fearAndGreed.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Preview Card */}
          <div className="glass-card rounded-2xl p-7 sm:p-8 border border-white/10 shadow-2xl shadow-cyan-500/15">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {t('landing.fearAndGreed.currentSentiment')}
              </h3>
              <span className="pill bg-white/10 border-white/10 text-xs">
                {t('landing.hero.features.marketIndicators.title')}
              </span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
              </div>
            ) : data ? (
              <div className="space-y-6">
                {/* Gauge Preview */}
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-white/5 border border-white/10 glow-ring" />
                  <div className="absolute inset-[10%] rounded-full bg-gradient-to-b from-slate-900/40 to-slate-900/70 border border-white/5" />
                  <div
                    className={`relative text-6xl font-black ${getSentimentColor(data.data.value)}`}
                  >
                    {data.data.value}
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getSentimentBg(data.data.value)} ${getSentimentColor(data.data.value)}`}
                    >
                      {data.data.value_classification}
                    </div>
                  </div>
                </div>

                <p className="text-slate-200/80 text-sm leading-relaxed text-center">
                  {t('landing.fearAndGreed.description')}
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="pill flex items-center gap-2 bg-white/5 border-white/10">
                    <span className="h-2 w-2 rounded-full bg-green-300" />
                    {t('landing.fearAndGreed.features.realTimeUpdates')}
                  </div>
                  <div className="pill flex items-center gap-2 bg-white/5 border-white/10">
                    <span className="h-2 w-2 rounded-full bg-blue-300" />
                    {t('landing.fearAndGreed.features.historicalAnalysis')}
                  </div>
                  <div className="pill flex items-center gap-2 bg-white/5 border-white/10">
                    <span className="h-2 w-2 rounded-full bg-purple-300" />
                    {t('landing.fearAndGreed.features.marketInsights')}
                  </div>
                  <div className="pill flex items-center gap-2 bg-white/5 border-white/10">
                    <span className="h-2 w-2 rounded-full bg-orange-300" />
                    {t('landing.fearAndGreed.features.tradingSignals')}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-300 text-center">Unable to load market data</div>
            )}
          </div>

          {/* Features List */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-7 border border-white/10 space-y-5">
              <h3 className="text-2xl font-bold text-white">
                {t('landing.fearAndGreed.whyMonitor')}
              </h3>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-xl">
                    📈
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-white">
                      {t(
                        'landing.fearAndGreed.benefits.contrarianOpportunities.title',
                      )}
                    </h4>
                    <p className="text-sm text-slate-200/80">
                      {t(
                        'landing.fearAndGreed.benefits.contrarianOpportunities.description',
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-xl">
                    🎯
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-white">
                      {t('landing.fearAndGreed.benefits.riskManagement.title')}
                    </h4>
                    <p className="text-sm text-slate-200/80">
                      {t(
                        'landing.fearAndGreed.benefits.riskManagement.description',
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-xl">
                    📊
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-white">
                      {t(
                        'landing.fearAndGreed.benefits.dataDrivenDecisions.title',
                      )}
                    </h4>
                    <p className="text-sm text-slate-200/80">
                      {t(
                        'landing.fearAndGreed.benefits.dataDrivenDecisions.description',
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/10 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-white">
                  {t('landing.fearAndGreed.cta.title')}
                </h4>
                <p className="text-sm text-slate-200/80">
                  {t('landing.fearAndGreed.cta.description')}
                </p>
              </div>
              <a
                href={SIGN_UP_ROUTE}
                className="btn-neon px-4 py-2 text-sm whitespace-nowrap"
              >
                {t('landing.fearAndGreed.cta.button')}
                <ArrowRightIcon className="ml-1 w-4 h-4 inline-block align-middle" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
