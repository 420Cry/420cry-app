'use client'

import { JSX, useState } from 'react'
import {
  CryButton,
  CryTextField,
  LockIcon,
  CheckCircleIcon,
  HelpIcon,
} from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/store'
import {
  HOME_ROUTE,
  TWO_FACTOR_ALTERNATIVE,
  twoFactorService,
  useLoading,
  useNotification,
} from '@/lib'
import { useRouter } from 'next/navigation'

const TwoFactorVerifyForm = (): JSX.Element => {
  const [otp, setOtp] = useState('')
  const t = useTranslations()
  const router = useRouter()
  const { setLoading } = useLoading()
  const { showNotification } = useNotification()
  const user = useAuthStore((state) => state.user)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!user?.uuid) {
        showNotification(
          'error',
          t('2fa.verify.errorTitle'),
          t('app.messages.error.general'),
        )
        return
      }
      if (!otp.trim()) {
        showNotification(
          'error',
          t('2fa.verify.errorTitle'),
          t('app.messages.error.otpCannotBeEmpty'),
        )
        return
      }

      const response = await twoFactorService.verify.verifyToken({
        userUUID: user.uuid,
        otp,
        rememberMe: user.rememberMe,
      })

      if (response.isSuccess) {
        showNotification(
          'success',
          t('2fa.verify.successTitle'),
          t('app.messages.success.2FAVerifySuccessful'),
        )
        router.push(HOME_ROUTE)
      } else {
        showNotification(
          'error',
          t('2fa.verify.errorTitle'),
          t(response.message),
        )
      }
    } catch {
      showNotification(
        'error',
        t('2fa.verify.errorTitle'),
        t('app.messages.error.general'),
      )
    } finally {
      setLoading(false)
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
            <LockIcon className="w-8 h-8 text-white" />
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
              onChange={(event) =>
                setOtp((event.target as HTMLInputElement).value)
              }
              placeholder="ABC123"
              shape="rounded"
              name="otp"
              className="text-center text-2xl font-mono tracking-widest px-6 py-4 bg-gray-50/50 border-gray-200 focus:border-green-500 focus:bg-white focus:shadow-lg transition-all duration-300 rounded-xl"
            />
          </div>

          <CryButton
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-base font-semibold px-6 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transform transition-all duration-300 shadow-lg border-0"
            shape="rounded"
          >
            <span className="flex items-center justify-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
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
              <HelpIcon className="w-4 h-4" />
              {t('2fa.verify.havingTroubleWithAuthenticatorApp')}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TwoFactorVerifyForm
