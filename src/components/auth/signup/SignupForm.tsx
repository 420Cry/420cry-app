'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CryButton, GoogleIcon, DiscordIcon } from '@420cry/420cry-lib'
import { ISignUp, TranslateFunction } from '@/src/types'
import {
  renderFormTextField,
  validateAllFieldsFilled,
  validateEmail,
  validatePasswordMatch,
} from '@/src/utils'
import { toast } from 'react-hot-toast'
import { signUpAction } from '@/src/actions/auth'

const initialFormValue: ISignUp = {
  fullname: '',
  email: '',
  username: '',
  password: '',
  repeatedPassword: '',
}

const SignupForm: React.FC = () => {
  const [formValue, setFormValue] = useState<ISignUp>(initialFormValue)
  const t = useTranslations()

  const updateFormState = (key: keyof ISignUp) => (value: string) =>
    setFormValue((prev) => ({ ...prev, [key]: value }))

  const validations = [
    (data: ISignUp, t: TranslateFunction) =>
      validateAllFieldsFilled(data, [
        'fullname',
        'email',
        'username',
        'password',
        'repeatedPassword',
      ], t),
    (data: ISignUp, t: TranslateFunction) => validateEmail(data, t),
    (data: ISignUp, t: TranslateFunction) => validatePasswordMatch(data, t),
  ]

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    for (const validation of validations) {
      if (!validation(formValue, t)) {
        return
      }
    }
    const result = await signUpAction(formValue)
    if (result.success) {
      toast.success(t(result.message))
    } else {
      toast.error(t(result.message))
    }
  }

  return (
    <div className="flex items-center justify-center mt-16 sm:mt-24 px-4">
      <div className="bg-transparent p-8 sm:p-16 w-full sm:w-5/12 rounded-2xl shadow-lg">
        <h1 className="text-center text-2xl sm:text-3xl mb-6 sm:mb-10 font-bold">
          {t('signup.title')}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap mb-4">
            <div className="w-full sm:w-1/2 sm:pr-4">
              {renderFormTextField(
                t('app.fields.fullname'),
                'fullname',
                formValue.fullname,
                updateFormState('fullname'),
              )}
            </div>
            <div className="w-full sm:w-1/2">
              {renderFormTextField(
                t('app.fields.email'),
                'email',
                formValue.email,
                updateFormState('email'),
              )}
            </div>
          </div>
          {renderFormTextField(
            t('app.fields.username'),
            'username',
            formValue.username,
            updateFormState('username'),
          )}
          {renderFormTextField(
            t('app.fields.password'),
            'password',
            formValue.password,
            updateFormState('password'),
            'password',
          )}
          {renderFormTextField(
            t('app.fields.repeatedPassword'),
            'repeatedPassword',
            formValue.repeatedPassword,
            updateFormState('repeatedPassword'),
            'password',
          )}
          <div className="flex justify-center mt-6">
            <CryButton
              circle
              className="bg-green-600 w-52 sm:w-60 text-white"
              type="submit"
            >
              {t('signup.title')}
            </CryButton>
          </div>
        </form>
        <div className="text-center text-sm sm:text-base mt-6 sm:mt-10 text-yellow-600">
          {t('signup.orSignInUsing')}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {[GoogleIcon, DiscordIcon].map((Icon, index) => (
            <CryButton
              key={index}
              size="lg"
              className="bg-transparent w-40"
              circle
              outlined
            >
              <div className="flex items-center justify-center">
                <Icon className="h-5 w-5 mr-2" />
                <div>{Icon === GoogleIcon ? 'Google' : 'Discord'}</div>
              </div>
            </CryButton>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SignupForm
