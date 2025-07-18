'use client'

import { HOME_ROUTE, showToast, TwoFactorSetUpService } from '@/lib'
import { CryButton } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { JSX, useState } from 'react'

const TwoFactorSetupOption = ({
  onSelect,
}: {
  // eslint-disable-next-line no-unused-vars
  onSelect: (method: 'phone' | 'app') => void
}): JSX.Element => {
  const [selectedMethod, setSelectedMethod] = useState<null | 'phone' | 'app'>(
    null,
  )
  const t = useTranslations()
  const router = useRouter()

  const baseCardClasses =
    'group border rounded-xl p-6 hover:shadow-lg active:scale-95 transition bg-white flex flex-col justify-between text-left w-full cursor-pointer focus:outline-none'

  const getCardClasses = (method: 'phone' | 'app') => {
    return `${baseCardClasses} ${
      selectedMethod === method
        ? 'border-blue-500 ring-2 ring-blue-300'
        : 'border-gray-200'
    }`
  }

  const skipForNow = async (e: React.MouseEvent) => {
    e.preventDefault()

    try {
      const skip = await TwoFactorSetUpService.skipForNow()
      if (skip.isSuccess) {
        router.push(HOME_ROUTE)
      }
    } catch {
      showToast(false, t('app.alertTitle.somethingWentWrong'))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-xl p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          {t('2fa.setup.title')}
        </h1>
        <p className="text-gray-600 mb-10 text-center">
          {t('2fa.setup.description')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CryButton
            onClick={() => {
              setSelectedMethod('phone')
              onSelect('phone')
            }}
            className={getCardClasses('phone')}
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="text-3xl">📱</div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {t('2fa.setup.useYourPhone')}
                </h2>
                <p className="text-sm text-gray-500">
                  {t('2fa.setup.receiveViaSMS')}
                </p>
              </div>
            </div>
          </CryButton>

          <CryButton
            onClick={() => {
              setSelectedMethod('app')
              onSelect('app')
            }}
            className={getCardClasses('app')}
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="text-3xl">🔒</div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {t('2fa.setup.useAnApp')}
                </h2>
                <p className="text-sm text-gray-500">{t('2fa.setup.scanQR')}</p>
              </div>
            </div>
          </CryButton>
        </div>
        <div className="mt-8 text-center">
          <a
            onClick={skipForNow}
            className="underline text-blue-500 hover:text-blue-800 cursor-pointer focus:outline-none"
          >
            {t('2fa.setup.skipForNow')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default TwoFactorSetupOption
