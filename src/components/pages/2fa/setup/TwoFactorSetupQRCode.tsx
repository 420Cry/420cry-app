'use client'

import { JSX, useEffect, useState } from 'react'
import { TwoFactorSetUpService } from '@/lib/client/2fa/setup/TwoFactorSetUpService'
import { CryButton, CryTextField } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import { HOME_ROUTE, showToast } from '@/lib'
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
  const [secret, setSecret] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')

  useEffect(() => {
    const fetchQRCodeAndSecret = async () => {
      setLoading(true)

      try {
        const data = await TwoFactorSetUpService.getQRCodeAndSecret({
          uuid: userUuid,
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
  }, [userUuid])

  const handleSubmit = async (
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e?.preventDefault()
    if (!token || token.length !== 6) {
      showToast(false, t('2fa.QR.invalidToken'))
      return
    }
    try {
      const payload = {
        uuid: userUuid,
        otp: token,
        secret: secret
      }
      const { response, user } =
        await TwoFactorSetUpService.verifyToken(payload)

      const success = response.isSuccess
      if (success && user) {
        useAuthStore.getState().setUser(user)
        router.push(HOME_ROUTE)
      }
    } catch {
      showToast(false, t('app.alertTitle.somethingWentWrong'))
    }
  }

  if (loading) {
    return <p className="text-center py-10">{t('common.loading')}</p>
  }
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 relative">
      <div className="absolute top-6 left-6">
        <CryButton
          onClick={onCancel}
          className="bg-gray-600 text-white px-5 py-2 text-base rounded hover:bg-gray-800 transition"
          rounded
        >
          ← {t('common.back')}
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
            <span className="font-bold mr-2">{t('common.step')}1: </span>{' '}
            {t('2fa.QR.stepOne')}
          </p>

          <div className="flex flex-col items-center mb-8">
            <div className="w-56 h-56 bg-white rounded-lg flex items-center justify-center text-gray-400 select-none mb-4">
              {qrCode ? (
                <Image
                  src={qrCode}
                  alt="2FA QR Code"
                  width={224} // 56 * 4 (since div is w-56)
                  height={224}
                  className="w-full h-full object-contain"
                />
              ) : (
                <p className="font-semibold text-lg">
                  {t('2fa.setup.qrCodeError')}
                </p>
              )}
            </div>

            {/* Secret key - bold and selectable */}
            {secret ? (
              <p className="font-bold text-center text-lg text-gray-800 select-all">
                {secret}
              </p>
            ) : (
              <p className="text-sm text-gray-500 italic">
                {t('common.loading')}
              </p>
            )}
          </div>

          <div className="my-6 border-t border-gray-300" />

          {/* Step 2 */}
          <p className="mb-4 text-center text-gray-700 text-lg max-w-md mx-auto">
            <span className="font-bold mr-2">{t('common.step')}2: </span>{' '}
            {t('2fa.QR.stepTwo')}
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-center">
              <CryTextField
                modelValue={token}
                name="token"
                shape="rounded"
                className="max-w"
                onChange={setToken}
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
            onClick={handleSubmit}
          >
            {t('common.verify')}
          </CryButton>
        </div>
      </div>
    </div>
  )
}

export default TwoFactorSetupQRCode
