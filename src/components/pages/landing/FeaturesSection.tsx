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
    <section className="py-16 bg-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t('landing.features.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t('landing.features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:transform hover:scale-105"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                {feature.description}
              </p>

              <ul className="space-y-2">
                {feature.features.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-center gap-2 text-sm text-gray-400"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            {t('landing.features.cta.title')}
          </h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('landing.features.cta.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CryButton
              to={SIGN_UP_ROUTE}
              className="hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition duration-200 transform hover:scale-105"
            >
              {t('landing.features.cta.getStarted')}
            </CryButton>
            <CryButton
              to={SIGN_IN_ROUTE}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              {t('landing.features.cta.signIn')}
            </CryButton>
          </div>

          <div className="mt-8 flex justify-center items-center gap-8 text-blue-100 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>{t('landing.features.cta.benefits.freeToStart')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>{t('landing.features.cta.benefits.noCreditCard')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>{t('landing.features.cta.benefits.cancelAnytime')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
