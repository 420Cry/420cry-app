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
    <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-10 border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        {t('2fa.verify.title')}
      </h1>
      <p className="text-gray-700 text-base text-center mb-8 font-mono">
        {t('2fa.verify.description')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <CryTextField
          modelValue={otp}
          onChange={setOtp}
          placeholder="Enter 6-digit code"
          shape="rounded"
          name="otp"
          className="text-xl px-6 py-4 focus:shadow-green-500/50 transition duration-300"
        />

        <CryButton
          type="submit"
          className="w-full bg-green-600 text-white text-lg font-semibold px-6 py-4 rounded-xl hover:bg-green-700 hover:scale-105 transform transition-all shadow-lg"
          rounded
        >
          {t('2fa.verify.verifyCode')}
        </CryButton>
      </form>

      <p
        className="mt-8 text-center text-base font-semibold text-gray-800 hover:underline cursor-pointer transition-colors"
        onClick={handleAuthenticatorTroubleClick}
      >
        {t('2fa.verify.havingTroubleWithAuthenticatorApp')}
      </p>
    </div>
  )
}

export default TwoFactorVerifyForm
