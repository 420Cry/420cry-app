'use client'

import { JSX } from 'react'
import { useTranslations } from 'next-intl'
import { SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '@/lib'
import { CryButton } from '@420cry/420cry-lib'

export default function FeaturesSection(): JSX.Element {
  const t = useTranslations()

  const features = [
    {
      icon: '📊',
      title: t('landing.features.items.marketIndicators.title'),
      description: t('landing.features.items.marketIndicators.description'),
      features: [
        t('landing.features.items.marketIndicators.features.liveMarketData'),
        t('landing.features.items.marketIndicators.features.historicalCharts'),
        t('landing.features.items.marketIndicators.features.sentimentAnalysis'),
        t('landing.features.items.marketIndicators.features.tradingInsights'),
      ],
    },
    {
      icon: '🔍',
      title: t('landing.features.items.blockchainExplorer.title'),
      description: t('landing.features.items.blockchainExplorer.description'),
      features: [
        t(
          'landing.features.items.blockchainExplorer.features.transactionSearch',
        ),
        t('landing.features.items.blockchainExplorer.features.walletAnalysis'),
        t('landing.features.items.blockchainExplorer.features.addressTracking'),
        t('landing.features.items.blockchainExplorer.features.xpubSupport'),
      ],
    },
    {
      icon: '🔐',
      title: t('landing.features.items.securePlatform.title'),
      description: t('landing.features.items.securePlatform.description'),
      features: [
        t('landing.features.items.securePlatform.features.twoFactorProtection'),
        t('landing.features.items.securePlatform.features.secureLogin'),
        t('landing.features.items.securePlatform.features.dataEncryption'),
        t('landing.features.items.securePlatform.features.privacyFocused'),
      ],
    },
    {
      icon: '📈',
      title: t('landing.features.items.portfolioTracking.title'),
      description: t('landing.features.items.portfolioTracking.description'),
      features: [
        t(
          'landing.features.items.portfolioTracking.features.portfolioOverview',
        ),
        t('landing.features.items.portfolioTracking.features.priceAlerts'),
        t(
          'landing.features.items.portfolioTracking.features.performanceTracking',
        ),
        t('landing.features.items.portfolioTracking.features.assetManagement'),
      ],
    },
    {
      icon: '🌐',
      title: t('landing.features.items.multiLanguage.title'),
      description: t('landing.features.items.multiLanguage.description'),
      features: [
        t('landing.features.items.multiLanguage.features.englishVietnamese'),
        t('landing.features.items.multiLanguage.features.easySwitching'),
        t('landing.features.items.multiLanguage.features.localizedContent'),
        t('landing.features.items.multiLanguage.features.globalAccessibility'),
      ],
    },
    {
      icon: '⚡',
      title: t('landing.features.items.realTimeUpdates.title'),
      description: t('landing.features.items.realTimeUpdates.description'),
      features: [
        t('landing.features.items.realTimeUpdates.features.liveDataFeeds'),
        t('landing.features.items.realTimeUpdates.features.instantUpdates'),
        t('landing.features.items.realTimeUpdates.features.highAvailability'),
        t('landing.features.items.realTimeUpdates.features.fastPerformance'),
      ],
    },
  ]

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20">
      <div className="absolute inset-0 neon-gradient opacity-90" aria-hidden />
      <div className="absolute inset-0 neon-grid" aria-hidden />
      <div className="absolute inset-0 grid-lines" aria-hidden />
      <div className="absolute -left-16 bottom-10 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 text-slate-50">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 pill">
            <span className="h-2 w-2 rounded-full bg-purple-300" />
            {t('landing.features.cta.benefits.freeToStart')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold gradient-text break-words">
            {t('landing.features.title')}
          </h2>
          <p className="text-xl text-slate-200/80 max-w-2xl mx-auto break-words">
            {t('landing.features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 border border-white/10 shadow-lg shadow-purple-500/15 hover:border-cyan-400/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                  {feature.icon}
                </div>
                <div className="h-[1px] flex-1 mx-3 bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 break-words">
                {feature.title}
              </h3>
              <p className="text-slate-200/80 mb-4 text-sm leading-relaxed break-words">
                {feature.description}
              </p>

              <ul className="space-y-2">
                {feature.features.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-center gap-2 text-sm text-slate-200/80"
                  >
                    <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="mt-16 glass-card rounded-2xl p-8 border border-white/10 shadow-2xl shadow-cyan-500/15 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-transparent to-cyan-500/20 pointer-events-none" />
          <div className="relative">
            <h3 className="text-3xl font-bold text-white mb-4 break-words">
              {t('landing.features.cta.title')}
            </h3>
            <p className="text-slate-200/80 mb-8 max-w-2xl break-words">
              {t('landing.features.cta.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CryButton
                to={SIGN_UP_ROUTE}
                className="btn-neon px-6 py-3 w-full sm:w-auto text-center"
              >
                {t('landing.features.cta.getStarted')}
              </CryButton>
              <CryButton
                to={SIGN_IN_ROUTE}
                className="btn-ghost px-6 py-3 w-full sm:w-auto text-center"
              >
                {t('landing.features.cta.signIn')}
              </CryButton>
            </div>

            <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-slate-200 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>{t('landing.features.cta.benefits.freeToStart')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                <span>{t('landing.features.cta.benefits.noCreditCard')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                <span>{t('landing.features.cta.benefits.cancelAnytime')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
