import { CryButton } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'

const TwoFactorSetupQRCode = ({ onCancel }: { onCancel: () => void }) => {
  const t = useTranslations()

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="max-w-lg w-full border rounded shadow overflow-hidden">
        <div className="bg-gray-100 px-6 py-4">
          <p className="text-lg font-semibold text-left">{t('2fa.QR.title')}</p>
        </div>

        <div className="bg-white px-6 py-8">
          <p className="mb-6 text-center text-gray-700">
            {t('2fa.QR.scanQRCodeWithApp')}
          </p>

          <div className="flex justify-center mb-4">
            <div className="w-52 h-52 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 select-none">
              <p className="font-semibold">QR CODE</p>
            </div>
          </div>

          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm font-medium">
              {t('2fa.QR.or')}
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <p className="mb-2 text-center text-sm text-gray-600">
            {t('2fa.QR.enterSixDigits')}
          </p>

          <form className="space-y-4">
            <div className="flex justify-center">
              <input
                id="token"
                name="token"
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="w-40 text-center border border-gray-300 rounded py-2 px-3 text-lg tracking-widest font-mono"
                placeholder="123456"
              />
            </div>
          </form>
        </div>

        <div className="bg-gray-100 px-6 py-4 flex justify-end gap-2">
          <CryButton
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-1.5 text-sm rounded hover:bg-gray-700 transition"
            rounded
          >
            {t('2fa.QR.cancel')}
          </CryButton>
          <CryButton
            className="bg-blue-500 text-white px-4 py-1.5 text-sm rounded hover:bg-blue-700 transition"
            rounded
          >
            {t('2fa.QR.verify')}
          </CryButton>
        </div>
      </div>
    </div>
  )
}
export default TwoFactorSetupQRCode
