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
  const method = searchParams.get('method') as 'phone' | 'app' | null
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
    <>
      {method === 'app' && user?.uuid ? (
        <TwoFactorSetupQRCode userUuid={user.uuid} onCancel={handleBack} />
      ) : (
        <>
          <TwoFactorSetupOption onSelect={handleSelect} />
          {showPhoneModal && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center">
                <h2 className="text-xl font-semibold mb-2">
                  {t('2fa.phone.warn')}
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  {t('2fa.phone.description')}
                </p>
                <CryButton
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  {t('app.common.ok')}
                </CryButton>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default TwoFactorSetupPage
