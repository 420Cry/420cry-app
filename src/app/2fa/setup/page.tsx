'use client'

import { TwoFactorSetupQRCode, TwoFactorSetupOption } from '@/components'
import React, { useState } from 'react'

const TwoFactorSetupPage = () => {
  const [selectedMethod, setSelectedMethod] = useState<null | 'phone' | 'app'>(
    null,
  )
  const [showPhoneModal, setShowPhoneModal] = useState(false)

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
                  Not supported in DEV MODE
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Phone verification is currently disabled while in development
                  mode.
                </p>
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default TwoFactorSetupPage
