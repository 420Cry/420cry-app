'use client'

import { JSX, useState, useMemo, useEffect } from 'react'
import { CryButton, CryTextField } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import { showToast, TWO_FACTOR_VERIFY_ROUTE } from '@/lib'
import { useAuthStore } from '@/store'
import { useRouter } from 'next/navigation'

const maskEmail = (email: string): string => {
  if (!email) return ''
  const [name, domain] = email.split('@')
  if (!name || !domain) return email
  const visiblePart = name.slice(0, 2)
  return `${visiblePart}${'*'.repeat(Math.max(1, name.length - 2))}@${domain}`
}

const TwoFactorAlternativeForm = (): JSX.Element => {
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [timeLeft, setTimeLeft] = useState(10 * 60) // 10 minutes
  const [canResend, setCanResend] = useState(false)
  const user = useAuthStore((state) => state.user)
  const t = useTranslations()

  const email = useMemo(() => maskEmail(user?.email || ''), [user?.email])

  // countdown timer
  useEffect(() => {
    if (!emailSent) return
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

  const handleSendEmail = async () => {
    try {
      setIsSending(true)
      // await TwoFactorService.sendEmailOTP(user?.email)
      showToast(true, t('2fa.alternative.emailSend', { email }))
      setEmailSent(true)
      setTimeLeft(10 * 60)
      setCanResend(false)
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
    try {
      // await TwoFactorService.verifyEmailOTP({ email: user?.email, otp })
      showToast(true, t('2fa.alternative.verifySuccess'))
    } catch {
      showToast(false, t('app.alertTitle.somethingWentWrong'))
    }
  }

  const router = useRouter()

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
    <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-10 border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        {title}
      </h1>
      <p className="text-gray-700 text-base text-center mb-8 font-mono">
        {description}
      </p>

      {!emailSent ? (
        <div>
          <div className="flex items-center space-x-4 w-full">
            <CryButton
              onClick={handleSendEmail}
              disabled={isSending}
              className="flex-shrink-0 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition font-medium shadow-lg text-lg"
              rounded
            >
              {isSending
                ? t('2fa.alternative.sending')
                : t('2fa.alternative.sendCode')}
            </CryButton>

            <div className="flex-1 bg-gray-900 text-green-400 font-mono text-sm rounded-lg px-4 py-3 shadow-inner text-right break-all">
              <span className="text-green-500 mr-2">$</span>
              {email}
            </div>
          </div>
          <CryButton
            onClick={handleBackClick}
            className="mt-4 w-full bg-gray-300 text-gray-800 text-lg font-semibold px-6 py-3 rounded-xl hover:bg-gray-400 transition-all shadow-lg"
            rounded
          >
            {t('2fa.alternative.backToVerify')}
          </CryButton>
        </div>
      ) : (
        <div className="flex flex-col space-y-6 items-center w-full">
          <CryTextField
            modelValue={otp}
            onChange={setOtp}
            shape="rounded"
            name="otp"
            className="w-full text-2xl px-8 py-5 focus:shadow-green-500/50 transition duration-300 font-mono tracking-wider"
            placeholder={t('2fa.alternative.enterVerificationCode')}
          />

          <CryButton
            onClick={handleVerify}
            className="w-full bg-green-600 text-white text-lg font-semibold px-6 py-4 rounded-xl hover:bg-green-700 hover:scale-105 transform transition-all shadow-lg"
            rounded
          >
            {t('2fa.verify.verifyCode')}
          </CryButton>

          <CryButton
            onClick={handleSendEmail}
            disabled={!canResend || isSending}
            className={`mt-4 w-full ${
              canResend
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-gray-400 cursor-not-allowed'
            } text-white text-lg font-semibold px-6 py-3 rounded-xl transition-all shadow-lg`}
            rounded
          >
            {canResend
              ? t('2fa.alternative.resendCode')
              : `${t('2fa.alternative.resendIn')} ${minutes}:${seconds
                  .toString()
                  .padStart(2, '0')}`}
          </CryButton>
        </div>
      )}
    </div>
  )
}

export default TwoFactorAlternativeForm
