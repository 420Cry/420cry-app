'use client'

import { JSX, useState } from 'react'
import { CryButton, CryTextField } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/store'
import { HOME_ROUTE, showToast, TwoFactorVerifyService } from '@/lib'
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

      const response = await TwoFactorVerifyService.verifyToken({
        userUUID: user.uuid,
        otp,
        rememberMe: user.rememberMe
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
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          {t('2fa.verify.title')}
        </h1>
        <p className="text-gray-600 text-sm text-center mb-6">
          {t('2fa.verify.description')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CryTextField
            modelValue={otp}
            onChange={setOtp}
            placeholder="Enter 6-digit code"
            shape="rounded"
            name="otp"
          />

          <CryButton
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            rounded
          >
            {t('2fa.verify.verifyCode')}
          </CryButton>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {t('2fa.verify.remider')}
        </p>
      </div>
    </div>
  )
}

export default TwoFactorVerifyForm
