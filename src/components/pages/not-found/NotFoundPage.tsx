'use client'

import { JSX } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { LanguageChangeButton } from '@/components'
import { SIGN_UP_ROUTE, LANDING_PAGE_ROUTE, SIGN_IN_ROUTE } from '@/lib'

export default function NotFoundPage(): JSX.Element {
  const t = useTranslations()

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/background/blackHoneyComb.jpg')] opacity-20"></div>

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageChangeButton />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative">
            {/* Large 404 Text */}
            <h1 className="text-9xl md:text-[12rem] font-bold text-white/20 mb-4 select-none">
              404
            </h1>

            {/* Floating Elements */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-6xl md:text-8xl mb-4 animate-bounce">🚀</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('notFound.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
            {t('notFound.description')}
          </p>
          <p className="text-lg text-gray-400">
            {t('notFound.subDescription')}
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition duration-300">
            <div className="text-3xl mb-3">🏠</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {t('notFound.actions.home.title')}
            </h3>
            <p className="text-gray-300 text-sm">
              {t('notFound.actions.home.description')}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition duration-300">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {t('notFound.actions.explore.title')}
            </h3>
            <p className="text-gray-300 text-sm">
              {t('notFound.actions.explore.description')}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition duration-300">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {t('notFound.actions.market.title')}
            </h3>
            <p className="text-gray-300 text-sm">
              {t('notFound.actions.market.description')}
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={LANDING_PAGE_ROUTE}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <span>🏠</span>
            {t('notFound.buttons.goHome')}
          </Link>
          <Link
            href={SIGN_IN_ROUTE}
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-4 px-8 rounded-lg transition duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>🔐</span>
            {t('notFound.buttons.signIn')}
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-3">
              {t('notFound.help.title')}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {t('notFound.help.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href={SIGN_UP_ROUTE}
                className="text-blue-400 hover:text-blue-300 transition duration-200"
              >
                {t('notFound.help.links.signUp')}
              </Link>
              <span className="text-gray-500">•</span>
              <Link
                href={LANDING_PAGE_ROUTE}
                className="text-blue-400 hover:text-blue-300 transition duration-200"
              >
                {t('notFound.help.links.dashboard')}
              </Link>
              <span className="text-gray-500">•</span>
              <Link
                href={LANDING_PAGE_ROUTE}
                className="text-blue-400 hover:text-blue-300 transition duration-200"
              >
                {t('notFound.help.links.marketIndicators')}
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-5 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
    </div>
  )
}
