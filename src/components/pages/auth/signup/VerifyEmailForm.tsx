'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CryButton, CryTextBox, VerifyAccountIcon } from '@420cry/420cry-lib'
import { IVerificationDigit } from '@/types'
import { VerifyEmailTokenService } from '@/services'
import { showToast, SIGN_IN_ROUTE } from '@/lib'
import { useRouter } from 'next/navigation'

const VerifyEmailForm: React.FC = () => {
  const t = useTranslations()
  const router = useRouter()

  const [code, setCode] = useState<IVerificationDigit>({
    firstDigit: '',
    secondDigit: '',
    thirdDigit: '',
    fourthDigit: '',
    fifthDigit: '',
    sixthDigit: '',
  })

  const [loading, setLoading] = useState(false)
  const [verificationSuccess, setVerificationSuccess] = useState<
    boolean | null
  >(null) // New state to track success

  const codeKeys: (keyof IVerificationDigit)[] = [
    'firstDigit',
    'secondDigit',
    'thirdDigit',
    'fourthDigit',
    'fifthDigit',
    'sixthDigit',
  ]

  const handleChange = (key: keyof IVerificationDigit, value: string) => {
    const char = value.trim().slice(0, 1)

    setCode((prev) => ({
      ...prev,
      [key]: char,
    }))
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').slice(0, 6).replace(/\s/g, '')

    const newCode: Partial<IVerificationDigit> = {}
    paste.split('').forEach((char, idx) => {
      const key = codeKeys[idx]
      if (key) {
        newCode[key] = char
      }
    })

    setCode((prev) => ({
      ...prev,
      ...newCode,
    }))
  }

  const handleConfirm = async () => {
    setLoading(true)
    const token = Object.values(code).join('')
    try {
      const response = await VerifyEmailTokenService.verifyToken(token)
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

  return (
    <div className="flex items-center justify-center mt-16 sm:mt-24 px-4">
      <div className="bg-transparent p-8 sm:p-16 w-full sm:w-5/12 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-6">
          <VerifyAccountIcon color="white" className="h-1/4 w-1/4" />
        </div>

        <h1 className="text-center text-2xl sm:text-3xl mb-6 sm:mb-10 font-bold">
          {t('signup.verifyEmail.title')}
        </h1>
        <p className="text-center text-base sm:text-lg text-gray-600 mb-6">
          {t('signup.verifyEmail.message')}
        </p>

        <div className="flex justify-center mt-4 gap-4">
          {codeKeys.map((key) => (
            <CryTextBox
              key={key}
              value={code[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              onPaste={handlePaste}
              borderColor={
                verificationSuccess === false && !code[key]
                  ? 'error'
                  : code[key]
                    ? 'success'
                    : 'default'
              }
            />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <CryButton
            color="success"
            className="w-1/3"
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
