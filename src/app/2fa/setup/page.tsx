'use client'

import { TwoFactorSetupQRCode, TwoFactorSetupOption } from '@/components'
import { CryButton } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import React, { JSX, useState } from 'react'

const TwoFactorSetupPage = (): JSX.Element => {
  const [selectedMethod, setSelectedMethod] = useState<null | 'phone' | 'app'>(
    null,
  )
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const t = useTranslations()
  const handleSelect = (method: 'phone' | 'app') => {
    if (method === 'phone') {
      setShowPhoneModal(true)
    } else {
      setSelectedMethod(method)
    }
  }

  const handleCloseModal = () => {
    setShowPhoneModal(false)
  }

  const handleBack = () => {
    setSelectedMethod(null)
  }

  return (
    <>
      {selectedMethod === 'app' ? (
        <TwoFactorSetupQRCode onCancel={handleBack} />
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
                  {t('common.ok')}
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
