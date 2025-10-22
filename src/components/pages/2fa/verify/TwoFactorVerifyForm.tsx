'use client'

import { JSX, useState } from 'react'
import { CryButton, CryTextField } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/store'
import {
  HOME_ROUTE,
  showToast,
  TWO_FACTOR_ALTERNATIVE,
  twoFactorService,
} from '@/lib'
import { useRouter } from 'next/navigation'

const TwoFactorVerifyForm = (): JSX.Element => {
  const [otp, setOtp] = useState('')
  const t = useTranslations()
  const router = useRouter()
  const user = useAuthStore((state) => state.user)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!user?.uuid) {
        showToast(false, t('app.alertTitle.somethingWentWrong'))
        return
      }
      if (!otp.trim()) {
        showToast(false, t('app.alertTitle.otpCannotBeEmpty'))
        return
      }

      const response = await twoFactorService.verify.verifyToken({
        userUUID: user.uuid,
        otp,
        rememberMe: user.rememberMe,
      })

      if (response.isSuccess) {
        showToast(true, t('app.alertTitle.2FAVerifySuccessful'))
        router.push(HOME_ROUTE)
      } else {
        showToast(false, t(response.message))
      }
    } catch {
      showToast(false, t('app.alertTitle.somethingWentWrong'))
    }
  }

  const handleAuthenticatorTroubleClick = () => {
    router.push(TWO_FACTOR_ALTERNATIVE)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Card */}
      <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-gray-100/50 relative overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-blue-50/30 pointer-events-none" />

        {/* Header Section */}
        <div className="relative z-10 text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-3 text-gray-900 tracking-tight">
            {t('2fa.verify.title')}
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
            {t('2fa.verify.description')}
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div className="space-y-2">
            <CryTextField
              modelValue={otp}
              onChange={setOtp}
              placeholder="ABC123"
              shape="rounded"
              name="otp"
              className="text-center text-2xl font-mono tracking-widest px-6 py-4 bg-gray-50/50 border-gray-200 focus:border-green-500 focus:bg-white focus:shadow-lg transition-all duration-300 rounded-xl"
            />
          </div>

          <CryButton
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-base font-semibold px-6 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transform transition-all duration-300 shadow-lg border-0"
            rounded
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {t('2fa.verify.verifyCode')}
            </span>
          </CryButton>
        </form>

        {/* Footer Section */}
        <div className="relative z-10 mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            className="w-full text-center text-sm font-medium text-gray-600 hover:text-green-600 hover:underline transition-colors duration-200 py-2"
            onClick={handleAuthenticatorTroubleClick}
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {t('2fa.verify.havingTroubleWithAuthenticatorApp')}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TwoFactorVerifyForm
