'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { TwoFactorSetupQRCode, TwoFactorSetupOption } from '@/components'
import { useAuthStore } from '@/store'
import { CryButton } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import React, { JSX } from 'react'

const TwoFactorSetupPage = (): JSX.Element => {
  const user = useAuthStore((state) => state.user)
  const searchParams = useSearchParams()
  const t = useTranslations()
  const router = useRouter()

  // Read 'method' query param from URL: 'phone' | 'app' | null
  const method = (searchParams?.get('method') ?? null) as 'phone' | 'app' | null
  const showPhoneModal = method === 'phone'

  const handleSelect = (selectedMethod: 'phone' | 'app') => {
    router.replace(`/2fa/setup?method=${selectedMethod}`, { scroll: false })
  }

  const handleCloseModal = () => {
    router.replace('/2fa/setup', { scroll: false })
  }

  const handleBack = () => {
    router.replace('/2fa/setup', { scroll: false })
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {method === 'app' && user?.uuid ? (
        <TwoFactorSetupQRCode userUuid={user.uuid} onCancel={handleBack} />
      ) : (
        <>
          <TwoFactorSetupOption onSelect={handleSelect} />
          {showPhoneModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center animate-scale-in">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 mx-auto">
                  <span className="text-2xl">📱</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('2fa.phone.warn')}
                </h2>
                <p className="text-base text-gray-600 mb-8 leading-relaxed">
                  {t('2fa.phone.description')}
                </p>
                <CryButton
                  onClick={handleCloseModal}
                  className="px-8 py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {t('app.common.ok')}
                </CryButton>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TwoFactorSetupPage
