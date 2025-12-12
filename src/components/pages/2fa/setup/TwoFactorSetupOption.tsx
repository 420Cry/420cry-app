'use client'

import { HOME_ROUTE, useNotification, useTwoFactorService } from '@/lib'
import { CryButton } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { JSX, useState } from 'react'

const TwoFactorSetupOption = ({
  onSelect,
}: {
  onSelect: (method: 'phone' | 'app') => void
}): JSX.Element => {
  const [selectedMethod, setSelectedMethod] = useState<null | 'phone' | 'app'>(
    null,
  )
  const t = useTranslations()
  const router = useRouter()
  const { showNotification } = useNotification()
  const twoFactorService = useTwoFactorService()

  const baseCardClasses =
    'group relative overflow-hidden rounded-2xl p-8 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl flex flex-col justify-center items-center text-center w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30 min-h-[240px]'

  const getCardClasses = (method: 'phone' | 'app') => {
    return `${baseCardClasses} ${
      selectedMethod === method
        ? 'ring-2 ring-blue-500/40 bg-gradient-to-br from-blue-50/90 to-white/90 shadow-xl shadow-blue-500/20 border-blue-300/50'
        : 'hover:bg-white/90 hover:border-blue-200/50'
    }`
  }

  const skipForNow = async (e: React.MouseEvent) => {
    e.preventDefault()

    try {
      const skip = await twoFactorService.setup.skipForNow()
      if (skip.isSuccess) {
        router.push(HOME_ROUTE)
      }
    } catch {
      showNotification(
        'error',
        t('2fa.setup.errorTitle'),
        t('app.messages.error.general'),
      )
    }
  }

  return (
    <div className="w-full">
      <div className="relative bg-white/70 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-xl shadow-gray-900/10 p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg shadow-blue-500/25">
            <span className="text-xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3 tracking-tight">
            {t('2fa.setup.title')}
          </h1>
          <p className="text-base text-gray-600 leading-relaxed max-w-xl mx-auto">
            {t('2fa.setup.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CryButton
            onClick={() => {
              setSelectedMethod('phone')
              onSelect('phone')
            }}
            className={getCardClasses('phone')}
          >
            <div className="relative w-full">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              {/* Icon Container */}
              <div className="relative mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:scale-110 transition-all duration-300">
                  <span className="text-2xl group-hover:animate-pulse">📱</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>

              {/* Content */}
              <div className="relative">
                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                  {t('2fa.setup.useYourPhone')}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-normal">
                  {t('2fa.setup.receiveViaSMS')}
                </p>

                {/* Feature List */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center text-xs text-gray-500 whitespace-normal">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                    <span className="break-words">Instant SMS delivery</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 whitespace-normal">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                    <span className="break-words">Works with any phone</span>
                  </div>
                </div>
              </div>
            </div>
          </CryButton>

          <CryButton
            onClick={() => {
              setSelectedMethod('app')
              onSelect('app')
            }}
            className={getCardClasses('app')}
          >
            <div className="relative w-full">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              {/* Icon Container */}
              <div className="relative mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 group-hover:scale-110 transition-all duration-300">
                  <span className="text-2xl group-hover:animate-spin">🔒</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
              </div>

              {/* Content */}
              <div className="relative">
                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors duration-300">
                  {t('2fa.setup.useAnApp')}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-normal">
                  {t('2fa.setup.scanQR')}
                </p>

                {/* Feature List */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center text-xs text-gray-500 whitespace-normal">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 flex-shrink-0"></span>
                    <span className="break-words">Works offline</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 whitespace-normal">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 flex-shrink-0"></span>
                    <span className="break-words">More secure</span>
                  </div>
                </div>
              </div>
            </div>
          </CryButton>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={skipForNow}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300/50 hover:shadow-md"
          >
            <span className="mr-2">⏭️</span>
            {t('2fa.setup.skipForNow')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TwoFactorSetupOption
