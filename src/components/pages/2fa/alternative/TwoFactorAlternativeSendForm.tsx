'use client'

import { JSX, useState, useMemo, useEffect } from 'react'
import {
  CryButton,
  CryTextField,
  CheckCircleIcon,
  LoadingIcon,
  RefreshIcon,
} from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import {
  HOME_ROUTE,
  TWO_FACTOR_VERIFY_ROUTE,
  useLoading,
  useNotification,
  useTwoFactorService,
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
  const { showNotification } = useNotification()
  const twoFactorService = useTwoFactorService()
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
          showNotification(
            'warning',
            t('2fa.alternative.warningTitle'),
            t('2fa.alternative.otpExpired'),
          )
          return 0
        }
        if (prev === 10 * 60 - 30) {
          setCanResend(true)
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [emailSent, t, showNotification])

  const handleSendAlternativeEmail = async () => {
    const userEmail = user?.email
    if (!userEmail) {
      showNotification(
        'error',
        t('2fa.alternative.errorTitle'),
        t('app.messages.error.emailNotExist'),
      )
      return
    }

    setIsSending(true)
    try {
      const response =
        await twoFactorService.alternative.sendAlternativeEmailOTP(userEmail)

      if (response.isSuccess) {
        showNotification(
          'success',
          t('2fa.alternative.successTitle'),
          t('2fa.alternative.emailSend', { email }),
        )
        setEmailSent(true)
        setTimeLeft(5 * 60) // 5 mins
        setCanResend(false)
      } else {
        showNotification(
          'error',
          t('2fa.alternative.errorTitle'),
          t(response.message),
        )
      }
    } catch {
      showNotification(
        'error',
        t('2fa.alternative.errorTitle'),
        t('app.messages.error.general'),
      )
    } finally {
      setIsSending(false)
    }
  }

  const handleVerify = async () => {
    if (!otp.trim()) {
      showNotification(
        'error',
        t('2fa.alternative.errorTitle'),
        t('app.messages.error.otpCannotBeEmpty'),
      )
      return
    }
    setLoading(true)
    try {
      if (!user?.uuid) {
        showNotification(
          'error',
          t('2fa.alternative.errorTitle'),
          t('app.messages.error.general'),
        )
        return
      }
      const response =
        await twoFactorService.alternative.verifyAlternativeToken({
          userUUID: user.uuid,
          otp,
          rememberMe: user.rememberMe,
        })
      if (response.isSuccess) {
        showNotification(
          'success',
          t('2fa.alternative.successTitle'),
          t('app.messages.success.2FAVerifySuccessful'),
        )
        router.push(HOME_ROUTE)
      } else {
        showNotification(
          'error',
          t('2fa.alternative.errorTitle'),
          t(response.message),
        )
      }
    } catch {
      showNotification(
        'error',
        t('2fa.alternative.errorTitle'),
        t('app.messages.error.general'),
      )
    } finally {
      setLoading(false)
    }
  }

  const handleBackClick = () => {
    router.push(TWO_FACTOR_VERIFY_ROUTE)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (emailSent && otp.trim()) {
      handleVerify()
    }
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
          <CheckCircleIcon className="w-8 h-8 text-white" />
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
              shape="rounded"
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
            variant="outline"
            color="primary"
            className="w-full text-lg font-semibold px-6 py-4 rounded-2xl"
            shape="rounded"
          >
            {t('2fa.alternative.backToVerify')}
          </CryButton>
        </div>
      ) : (
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col space-y-8 items-center w-full"
        >
          <div className="w-full relative">
            <CryTextField
              modelValue={otp}
              onChange={(event) =>
                setOtp((event.target as HTMLInputElement).value)
              }
              shape="rounded"
              name="otp"
              className="text-center text-2xl font-mono tracking-widest px-6 py-4 bg-gray-50/50 border-gray-200 focus:border-green-500 focus:bg-white focus:shadow-lg transition-all duration-300 rounded-xl"
              placeholder={t('2fa.alternative.enterVerificationCode')}
            />
          </div>

          <CryButton
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-semibold px-8 py-5 rounded-2xl hover:from-green-600 hover:to-emerald-700 hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            shape="rounded"
          >
            <div className="flex items-center justify-center space-x-2">
              <CheckCircleIcon className="w-5 h-5" />
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
            shape="rounded"
          >
            <div className="flex items-center justify-center space-x-2">
              {canResend ? (
                <>
                  <RefreshIcon className="w-5 h-5 rotate-180" />
                  <span>{t('2fa.alternative.resendCode')}</span>
                </>
              ) : (
                <>
                  <LoadingIcon className="w-5 h-5 animate-spin" />
                  <span>{`${t('2fa.alternative.resendIn')} ${minutes}:${seconds
                    .toString()
                    .padStart(2, '0')}`}</span>
                </>
              )}
            </div>
          </CryButton>
        </form>
      )}
    </div>
  )
}

export default TwoFactorAlternativeSendForm
