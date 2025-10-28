'use client'

import { JSX, useEffect, useState } from 'react'
import {
  CryButton,
  CryTextField,
  LockIcon,
  CheckCircleIcon,
  XIcon,
} from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useAuthStore } from '@/store'
import { twoFactorService, showToast } from '@/lib'

interface SetUpTwoFAProps {
  onClose: () => void
  onSuccess: () => void
}

export const SetUpTwoFA = ({
  onClose,
  onSuccess,
}: SetUpTwoFAProps): JSX.Element => {
  const t = useTranslations()
  const { user } = useAuthStore()

  const [secret, setSecret] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [otp, setOtp] = useState('')
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    const fetchQRCodeAndSecret = async () => {
      if (!user?.uuid) {
        showToast(false, t('app.alertTitle.somethingWentWrong'))
        return
      }

      setLoading(true)
      try {
        const data = await twoFactorService.setup.getQRCodeAndSecret({
          uuid: user.uuid,
        })
        setSecret(data.secret)
        setQrCode(data.qrCode)
      } catch (error) {
        showToast(false, error instanceof Error ? error.message : String(error))
      } finally {
        setLoading(false)
      }
    }

    fetchQRCodeAndSecret()
  }, [user?.uuid, t])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otp.trim() || otp.length !== 6) {
      showToast(false, t('app.alertTitle.otpCannotBeEmpty'))
      return
    }

    if (!user?.uuid || !secret) {
      showToast(false, t('app.alertTitle.somethingWentWrong'))
      return
    }

    setVerifying(true)
    try {
      const payload = {
        uuid: user.uuid,
        otp: otp,
        secret: secret,
      }
      const { response, user: updatedUser } =
        await twoFactorService.setup.verifyToken(payload)

      if (response.isSuccess && updatedUser) {
        useAuthStore.getState().setUser(updatedUser)
        showToast(true, t('app.alertTitle.2FASetUpSuccessful'))
        onSuccess()
      } else {
        showToast(false, t(response.message))
      }
    } catch {
      showToast(false, t('app.alertTitle.somethingWentWrong'))
    } finally {
      setVerifying(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center py-10">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {t('app.common.loading')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <LockIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('2fa.QR.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {t('2fa.QR.scanQRCodeWithApp')}
        </p>
      </div>

      {/* QR Code Section */}
      <div className="mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-sm font-medium shadow-lg">
            <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold mr-2">
              1
            </span>
            <span>{t('2fa.QR.stepOne')}</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative group mb-4">
            <div className="w-48 h-48 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center shadow-lg border-2 border-gray-200 dark:border-gray-600 group-hover:border-purple-300 transition-all duration-300">
              {qrCode ? (
                <Image
                  src={qrCode}
                  alt="2FA QR Code"
                  width={192}
                  height={192}
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <span className="text-gray-400 text-xl">📱</span>
                  </div>
                  <p className="font-medium text-sm text-gray-500 dark:text-gray-400">
                    {t('2fa.setup.qrCodeError')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Secret key */}
          {secret && (
            <div className="w-full">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 text-center font-medium">
                  Secret Key
                </p>
                <p className="font-mono text-xs text-center text-gray-800 dark:text-gray-200 select-all break-all leading-relaxed">
                  {secret}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <div className="mx-3 w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      {/* Verification Section */}
      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium shadow-lg">
              <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                2
              </span>
              <span>{t('2fa.QR.stepTwo')}</span>
            </div>
          </div>

          <CryTextField
            modelValue={otp}
            onChange={(event) => {
              const value = (event.target as HTMLInputElement).value
              setOtp(value.slice(0, 6))
            }}
            placeholder={t('2fa.alternative.enterVerificationCode')}
            name="otp"
            type="text"
            className="text-center text-2xl font-mono tracking-widest px-4 py-3 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-300 rounded-xl"
          />
        </div>

        <div className="flex gap-3">
          <CryButton
            type="button"
            onClick={onClose}
            disabled={verifying}
            className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium"
          >
            <XIcon className="w-4 h-4 inline mr-2" />
            {t('app.common.cancel')}
          </CryButton>
          <CryButton
            type="submit"
            disabled={verifying || !otp.trim() || otp.length !== 6}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg text-sm font-medium"
          >
            {verifying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                {t('app.common.loading')}
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-4 h-4 inline mr-2" />
                {t('app.common.verify')}
              </>
            )}
          </CryButton>
        </div>
      </form>
    </div>
  )
}
