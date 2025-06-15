'use client'

import { CryButton, CryTextBox, CryTextField } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import React from 'react'

const TwoFASetupForm = () => {
  const t = useTranslations()

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full p-6 border rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {t('2fa.setup')}
        </h2>
        <p className="mb-6 text-center text-gray-700">
          {t('2fa.scanQRCodeWithApp')}
        </p>

        {/* QR Code placeholder */}
        <div className="flex justify-center mb-4">
          <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 select-none">
            QR Code
          </div>
        </div>

        {/* Manual key */}
        <p className="mb-6 text-center font-mono text-lg tracking-widest select-all">
          ABCD EFGH IJKL MNOP
        </p>

        {/* Input form */}
        <form className="space-y-4">
          <label
            htmlFor="token"
            className="block text-sm font-medium text-gray-700 text-center"
          >
            Enter 6-digit code from your app
          </label>
          <div className="flex justify-center gap-4"></div>

          <CryButton className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Verify
          </CryButton>
        </form>

        {/* Error message placeholder */}
        <p
          className="mt-4 text-center text-red-600"
          style={{ visibility: 'hidden' }}
        >
          Invalid code, please try again.
        </p>
      </div>
    </div>
  )
}

export default TwoFASetupForm
