'use client'

import { JSX, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CryButton, CryTextBox, VerifyAccountIcon } from '@420cry/420cry-lib'
import { VerifyEmailTokenService } from '@/services'
import { showToast, SIGN_IN_ROUTE } from '@/lib'
import { useRouter } from 'next/navigation'

export interface ISignUpVerificationToken {
  userToken: string
  verifyToken: string
}

const codeKeys = [
  'firstDigit',
  'secondDigit',
  'thirdDigit',
  'fourthDigit',
  'fifthDigit',
  'sixthDigit',
] as const
type CodeKeys = (typeof codeKeys)[number]
const initialCode = codeKeys.reduce(
  (acc, key) => ({ ...acc, [key]: '' }),
  {} as Record<CodeKeys, string>,
)

interface VerifyEmailFormProps {
  userToken: string
}

const VerifyEmailForm = (): JSX.Element => {
  const t = useTranslations()
  const router = useRouter()

  const [code, setCode] = useState(initialCode)
  const [loading, setLoading] = useState(false)
  const [verificationSuccess, setVerificationSuccess] = useState<
    boolean | null
  >(null)

  const updateCode = (key: CodeKeys, value: string) => {
    setCode((prev) => ({
      ...prev,
      [key]: value.trim().slice(0, 1),
    }))
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData('text')
      .slice(0, 6)
      .replace(/\s/g, '')

    const newCode = { ...code }
    pasted.split('').forEach((char, idx) => {
      const key = codeKeys[idx]
      if (key) {
        newCode[key] = char
      }
    })

    setCode(newCode)
  }

  const handleConfirm = async () => {
    setLoading(true)
    const payload: ISignUpVerificationToken = {
      userToken,
      verifyToken: Object.values(code).join(''),
    }

    try {
      const response = await VerifyEmailTokenService.verifyToken(payload)
      setVerificationSuccess(response.isSuccess)
      showToast(response.isSuccess, t(response.message))
      if (response.isSuccess) {
        router.push(SIGN_IN_ROUTE)
      }
    } catch {
      showToast(false, t('app.alertTitle.somethingWentWrong'))
      setVerificationSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  const getBorderColor = (key: CodeKeys) => {
    if (verificationSuccess === false || !code[key]) return 'error'
    if (code[key]) return 'success'
    return 'default'
  }

  return (
    <div className="flex items-center justify-center mt-16 sm:mt-32 px-4">
      <div className="p-8 sm:p-24 w-full max-w-[900px] rounded-2xl backdrop-blur-md border border-white/10">
        <div className="flex justify-center mb-6">
          <VerifyAccountIcon color="white" className="h-1/4 w-1/4" />
        </div>

        <h1 className="text-center text-white text-2xl sm:text-3xl mb-6 sm:mb-10 font-bold">
          {t('signup.verifyEmail.title')}
        </h1>
        <p className="text-center text-base sm:text-lg text-gray-600 mb-6">
          {t('signup.verifyEmail.message')}
        </p>

        <div className="flex justify-center gap-4">
          {codeKeys.map((key) => (
            <CryTextBox
              key={key}
              value={code[key]}
              onChange={(e) => updateCode(key, e.target.value)}
              onPaste={handlePaste}
              borderColor={getBorderColor(key)}
              className="text-white"
            />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <CryButton
            color="success"
            className="w-52 sm:w-60 text-white"
            circle
            onClick={handleConfirm}
            disabled={loading}
          >
            {t('signup.verifyEmail.confirm')}
          </CryButton>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailForm
