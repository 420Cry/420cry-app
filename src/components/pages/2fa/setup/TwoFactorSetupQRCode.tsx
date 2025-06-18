'use client'

import { useAuthStore } from '@/store'
import { CryButton } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import { JSX } from 'react'

const TwoFactorSetupQRCode = ({
  onCancel,
}: {
  onCancel: () => void
}): JSX.Element => {
  const t = useTranslations()
  const user = useAuthStore((state) => state.user)
  console.log(user)
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 relative">
      {/* Back button top-left */}
      <div className="absolute top-6 left-6">
        <CryButton
          onClick={onCancel}
          className="bg-gray-600 text-white px-5 py-2 text-base rounded hover:bg-gray-800 transition"
          rounded
        >
          ← {t('common.back') || 'Back'}
        </CryButton>
      </div>

      <div className="max-w-lg w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-100 px-8 py-6">
          <p className="text-xl font-semibold text-left">{t('2fa.QR.title')}</p>
        </div>

        <div className="bg-white px-8 py-10">
          <p className="mb-4 text-center text-2xl font-semibold">
            {t('2fa.QR.scanQRCodeWithApp')}
          </p>
          <p className="mb-8 text-center text-gray-700 text-lg max-w-md mx-auto">
            {t('2fa.QR.description')}
          </p>

          {/* Step 1 */}
          <p className="mb-4 text-center text-gray-700 text-lg max-w-md mx-auto">
            <span className="font-bold mr-2">1.</span> {t('2fa.QR.stepOne')}
          </p>

          <div className="flex flex-col items-center mb-8">
            <div className="w-56 h-56 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 select-none mb-4">
              <p className="font-semibold text-lg">QR CODE</p>
            </div>

            {/* Secret key placeholder - bold and centered */}
            <p className="font-bold text-center text-lg text-gray-800 select-all">
              SECRET-KEY-1234567890
            </p>
          </div>

          <div className="my-6 border-t border-gray-300" />

          {/* Step 2 */}
          <p className="mb-4 text-center text-sm text-gray-600 max-w-md mx-auto">
            <span className="font-bold mr-2">2.</span> {t('2fa.QR.stepTwo')}
          </p>

          <form className="space-y-6">
            <div className="flex justify-center">
              <input
                id="token"
                name="token"
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="w-44 text-center border border-gray-300 rounded py-3 px-4 text-xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="123456"
              />
            </div>
          </form>
        </div>

        <div className="bg-gray-100 px-8 py-6 flex justify-end gap-4">
          <CryButton
            onClick={onCancel}
            className="bg-gray-600 text-white px-6 py-2 text-base rounded hover:bg-gray-800 transition"
            rounded
          >
            {t('common.cancel')}
          </CryButton>
          <CryButton
            className="bg-blue-600 text-white px-6 py-2 text-base rounded hover:bg-blue-800 transition"
            rounded
          >
            {t('common.verify')}
          </CryButton>
        </div>
      </div>
    </div>
  )
}

export default TwoFactorSetupQRCode
