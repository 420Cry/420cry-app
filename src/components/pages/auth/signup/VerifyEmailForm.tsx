'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CryButton, CryTextBox, VerifyAccountIcon } from '@420cry/420cry-lib'
import { IVerificationCode } from '@/types'

const VerifyEmailForm: React.FC = () => {
  const t = useTranslations()

  const [code, setCode] = useState<IVerificationCode>({
    firstCode: '',
    secondCode: '',
    thirdCode: '',
    fourthCode: '',
    fifthCode: '',
    sixthCode: '',
  })

  const handleChange = (key: keyof IVerificationCode, value: string) => {
    const char = value.slice(0, 1)

    setCode((prev) => ({
      ...prev,
      [key]: char,
    }))
  }

  const codeKeys: (keyof IVerificationCode)[] = [
    'firstCode',
    'secondCode',
    'thirdCode',
    'fourthCode',
    'fifthCode',
    'sixthCode',
  ]

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
              borderColor="default"
            />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <CryButton color="success" className="w-1/3" circle>
            {t('signup.verifyEmail.confirm')}
          </CryButton>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailForm
