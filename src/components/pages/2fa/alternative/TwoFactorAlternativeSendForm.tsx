'use client'

import { JSX, useState, useMemo, useEffect } from 'react'
import { CryButton, CryTextField } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import {
  HOME_ROUTE,
  showToast,
  TWO_FACTOR_VERIFY_ROUTE,
  twoFactorService,
  useLoading,
} from '@/lib'
import { useAuthStore } from '@/store'
import { useRouter } from 'next/navigation'

const maskEmail = (email: string): string => {
  if (!email) return ''
  const [name, domain] = email.split('@')
  if (!name || !domain) return email
  const visiblePart = name.slice(0, 2)
  return `${visiblePart}${'*'.repeat(Math.max(1, name.length - 2))}@${domain}`
}

const TwoFactorAlternativeSendForm = (): JSX.Element => {
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [timeLeft, setTimeLeft] = useState(5 * 60) // 5 minutes
  const [canResend, setCanResend] = useState(false)
  const user = useAuthStore((state) => state.user)
  const t = useTranslations()
  const router = useRouter()
  const { setLoading } = useLoading()
  const email = useMemo(() => maskEmail(user?.email || ''), [user?.email])

  // countdown timer
  useEffect(() => {
    if (!emailSent) return undefined

    setCanResend(false)
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setCanResend(true)
          showToast(false, t('2fa.alternative.otpExpired'))
          return 0
        }
        if (prev === 10 * 60 - 30) {
          setCanResend(true)
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [emailSent, t])

  const handleSendAlternativeEmail = async () => {
    const email = user?.email
    if (!email) {
      showToast(false, t('app.alertTitle.emailNotExist'))
      return
    }

    setIsSending(true)
    try {
      const response =
        await twoFactorService.alternative.sendAlternativeEmailOTP(email)

      if (response.isSuccess) {
        showToast(true, t('2fa.alternative.emailSend', { email }))
        setEmailSent(true)
        setTimeLeft(5 * 60) // 5 mins
        setCanResend(false)
      } else {
        showToast(false, t(response.message))
      }
    } catch {
      showToast(false, t('app.alertTitle.somethingWentWrong'))
    } finally {
      setIsSending(false)
    }
  }

  const handleVerify = async () => {
    if (!otp.trim()) {
      showToast(false, t('app.alertTitle.otpCannotBeEmpty'))
      return
    }
    setLoading(true)
    try {
      if (!user?.uuid) {
        showToast(false, t('app.alertTitle.somethingWentWrong'))
        return
      }
      const response =
        await twoFactorService.alternative.verifyAlternativeToken({
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
    } finally {
      setLoading(false)
    }
  }

  const handleBackClick = () => {
    router.push(TWO_FACTOR_VERIFY_ROUTE)
  }

  const title = emailSent
    ? t('2fa.alternative.verifyTitle')
    : t('2fa.alternative.title')
  const description = emailSent
    ? t('2fa.alternative.verifyDescription')
    : t('2fa.alternative.description')
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="w-full max-w-lg bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-3xl p-12 border border-gray-200/50 backdrop-blur-sm">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
          {description}
        </p>
      </div>

      {!emailSent ? (
        <div className="space-y-6">
          <div className="flex items-center space-x-4 w-full">
            <CryButton
              onClick={handleSendAlternativeEmail}
              disabled={isSending}
              className="flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl text-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              rounded
            >
              {isSending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                t('2fa.alternative.sendCode')
              )}
            </CryButton>

            <div className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 text-green-400 font-mono text-sm rounded-2xl px-6 py-4 shadow-inner border border-gray-700 text-right break-all relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-pulse"></div>
              <span className="text-green-500 mr-2 relative z-10">$</span>
              <span className="relative z-10">{email}</span>
            </div>
          </div>
          <CryButton
            onClick={handleBackClick}
            className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 text-lg font-semibold px-6 py-4 rounded-2xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-300"
            rounded
          >
            {t('2fa.alternative.backToVerify')}
          </CryButton>
        </div>
      ) : (
        <div className="flex flex-col space-y-8 items-center w-full">
          <div className="w-full relative">
            <CryTextField
              modelValue={otp}
              onChange={setOtp}
              shape="rounded"
              name="otp"
              className="text-center text-2xl font-mono tracking-widest px-6 py-4 bg-gray-50/50 border-gray-200 focus:border-green-500 focus:bg-white focus:shadow-lg transition-all duration-300 rounded-xl"
              placeholder={t('2fa.alternative.enterVerificationCode')}
            />
          </div>

          <CryButton
            onClick={handleVerify}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-semibold px-8 py-5 rounded-2xl hover:from-green-600 hover:to-emerald-700 hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            rounded
          >
            <div className="flex items-center justify-center space-x-2">
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
              <span>{t('2fa.verify.verifyCode')}</span>
            </div>
          </CryButton>

          <CryButton
            onClick={handleSendAlternativeEmail}
            disabled={!canResend || isSending}
            className={`w-full ${
              canResend
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl'
                : 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
            } text-white text-lg font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg`}
            rounded
          >
            <div className="flex items-center justify-center space-x-2">
              {canResend ? (
                <>
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>{t('2fa.alternative.resendCode')}</span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{`${t('2fa.alternative.resendIn')} ${minutes}:${seconds
                    .toString()
                    .padStart(2, '0')}`}</span>
                </>
              )}
            </div>
          </CryButton>
        </div>
      )}
    </div>
  )
}

export default TwoFactorAlternativeSendForm
