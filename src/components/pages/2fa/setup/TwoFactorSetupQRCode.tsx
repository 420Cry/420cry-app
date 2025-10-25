'use client'

import { JSX, useEffect, useState } from 'react'
import { CryButton, CryTextField } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import {
  HOME_ROUTE,
  twoFactorService,
  useLoading,
  useNotification,
} from '@/lib'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'

const TwoFactorSetupQRCode = ({
  userUuid,
  onCancel,
}: {
  userUuid: string
  onCancel: () => void
}): JSX.Element => {
  const t = useTranslations()
  const router = useRouter()
  const { setLoading: setGlobalLoading } = useLoading()
  const { showNotification } = useNotification()
  const [secret, setSecret] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')

  useEffect(() => {
    const fetchQRCodeAndSecret = async () => {
      setLoading(true)

      try {
        const data = await twoFactorService.setup.getQRCodeAndSecret({
          uuid: userUuid,
        })
        setSecret(data.secret)
        setQrCode(data.qrCode)
      } catch (error) {
        showNotification(
          'error',
          t('2fa.QR.errorTitle'),
          error instanceof Error ? error.message : String(error),
        )
      } finally {
        setLoading(false)
      }
    }

    fetchQRCodeAndSecret()
  }, [userUuid, t, showNotification])

  const handleSubmit = async (
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e?.preventDefault()
    if (!token || token.length !== 6) {
      showNotification(
        'error',
        t('2fa.QR.errorTitle'),
        t('2fa.QR.invalidToken'),
      )
      return
    }
    setGlobalLoading(true)
    try {
      const payload = {
        uuid: userUuid,
        otp: token,
        secret: secret,
      }
      const { response, user } =
        await twoFactorService.setup.verifyToken(payload)

      const success = response.isSuccess
      if (success && user) {
        useAuthStore.getState().setUser(user)
        showNotification(
          'success',
          t('2fa.QR.successTitle'),
          t('app.alertTitle.2FASetUpSuccessful'),
        )
        router.push(HOME_ROUTE)
      }
    } catch {
      showNotification(
        'error',
        t('2fa.QR.errorTitle'),
        t('app.alertTitle.somethingWentWrong'),
      )
    } finally {
      setGlobalLoading(false)
    }
  }

  if (loading) {
    return <p className="text-center py-10">{t('app.common.loading')}</p>
  }
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl shadow-gray-900/10 overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 p-6 text-center">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full mb-3 shadow-lg">
                <span className="text-lg">🔐</span>
              </div>
              <h1 className="text-xl font-bold text-white mb-1">
                {t('2fa.QR.title')}
              </h1>
              <p className="text-purple-100 text-xs">
                {t('2fa.QR.scanQRCodeWithApp')}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1 - QR Code */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center px-2.5 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white shadow-lg">
                  <span className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                    1
                  </span>
                  <span className="text-xs font-medium">
                    {t('2fa.QR.stepOne')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative group mb-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-white to-gray-50 rounded-xl flex items-center justify-center shadow-lg border-2 border-gray-200/50 group-hover:border-purple-300 transition-all duration-300">
                    {qrCode ? (
                      <Image
                        src={qrCode}
                        alt="2FA QR Code"
                        width={128}
                        height={128}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mb-1 mx-auto">
                          <span className="text-gray-400 text-sm">📱</span>
                        </div>
                        <p className="font-medium text-xs text-gray-500">
                          {t('2fa.setup.qrCodeError')}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                </div>

                {/* Secret key */}
                {secret ? (
                  <div className="w-full max-w-xs">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-2.5 border border-gray-200/50">
                      <p className="text-xs text-gray-500 mb-1 text-center font-medium">
                        Secret Key
                      </p>
                      <p className="font-mono text-xs text-center text-gray-800 select-all break-all leading-relaxed">
                        {secret}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="w-3 h-3 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin mr-2"></div>
                    {t('app.common.loading')}
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

            {/* Step 2 - Token Input */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white shadow-lg">
                  <span className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                    2
                  </span>
                  <span className="text-xs font-medium">
                    {t('2fa.QR.stepTwo')}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex justify-center">
                  <div className="relative group">
                    <CryTextField
                      modelValue={token}
                      name="token"
                      shape="rounded"
                      className="text-center text-base font-mono tracking-widest  transition-colors"
                      onChange={(event) =>
                        setToken((event.target as HTMLInputElement).value)
                      }
                      placeholder="ABC123"
                    />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg"></div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex justify-center gap-3">
            <CryButton
              onClick={onCancel}
              className="px-5 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300/50 hover:shadow-md"
              shape="rounded"
            >
              {t('app.common.cancel')}
            </CryButton>
            <CryButton
              className="px-5 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-300/50 hover:shadow-lg hover:scale-105 shadow-lg"
              shape="rounded"
              onClick={(event) =>
                handleSubmit(event as React.MouseEvent<HTMLButtonElement>)
              }
            >
              {t('app.common.verify')}
            </CryButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TwoFactorSetupQRCode
