'use client'

import { JSX } from 'react'
import { useTranslations } from 'next-intl'
import LanguageChangeButton from '../../common/header/LanguageChangeButton'

export default function HeroSection(): JSX.Element {
  const t = useTranslations()

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/background/blackHoneyComb.jpg')] opacity-20"></div>
      
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageChangeButton />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
            {t('landing.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            {t('landing.hero.subtitle')}
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('landing.hero.features.marketIndicators.title')}</h3>
            <p className="text-gray-300 text-sm">{t('landing.hero.features.marketIndicators.description')}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('landing.hero.features.blockchainExplorer.title')}</h3>
            <p className="text-gray-300 text-sm">{t('landing.hero.features.blockchainExplorer.description')}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('landing.hero.features.securePlatform.title')}</h3>
            <p className="text-gray-300 text-sm">{t('landing.hero.features.securePlatform.description')}</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/auth/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
          >
            {t('landing.hero.getStarted')}
          </a>
          <a
            href="/auth/login"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-4 px-8 rounded-lg transition duration-200 transform hover:scale-105"
          >
            {t('landing.hero.signIn')}
          </a>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm mb-4">{t('landing.hero.trustedBy')}</p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-gray-300 font-semibold">{t('landing.hero.trustIndicators.realTimeData')}</div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="text-gray-300 font-semibold">{t('landing.hero.trustIndicators.securePlatform')}</div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="text-gray-300 font-semibold">{t('landing.hero.trustIndicators.professionalTools')}</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  )
}
