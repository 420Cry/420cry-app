'use client'

import {
  CryButton,
  CryCheckBox,
  DiscordIcon,
  GoogleIcon,
} from '@420cry/420cry-lib'
import React, { useState } from 'react'
import { renderFormTextField, validateAllFieldsFilled } from '@/src/utils'
import { ISignIn } from '@/src/types'
import { RESET_PASSWORD_ROUTE, SIGN_UP_ROUTE } from '@/src/constants/routes'
import { useTranslations } from 'next-intl'
import { toast } from 'react-hot-toast'
import { signInAction } from '@/src/actions/auth'

const initialFormValue: ISignIn = {
  username: '',
  password: '',
  remember: false,
}

const LoginForm: React.FC = () => {
  const [formValue, setFormValue] = useState<ISignIn>(initialFormValue)
  const t = useTranslations()

  const updateFormState = (key: keyof ISignIn) => (value: string | boolean) =>
    setFormValue((prev) => ({ ...prev, [key]: value }))

  const formValidate = (): boolean => {
    return validateAllFieldsFilled(formValue, ['username', 'password'], t)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formValidate()) {
      const result = await signInAction(formValue)
      if (result.success) {
        toast.success(t(result.message))
      } else {
        toast.error(t(result.message))
      }
    }
  }

  return (
    <div className="flex items-center justify-center mt-16 sm:mt-32 px-4">
      <div className="bg-transparent p-8 sm:p-16 w-full sm:w-5/12 rounded-2xl shadow-lg">
        <h1 className="text-center text-2xl sm:text-3xl mb-6 sm:mb-10 font-bold">
          {t('login.title')}
        </h1>
        <form onSubmit={handleSubmit}>
          {renderFormTextField(
            t('app.fields.username'),
            'username',
            formValue.username,
            updateFormState('username'),
            'text',
            'circle',
          )}
          {renderFormTextField(
            t('app.fields.password'),
            'password',
            formValue.password,
            updateFormState('password'),
            'password',
            'circle',
          )}
          <div className="flex justify-between w-full">
            <div className="text-left">
              <CryCheckBox
                text={t('login.rememberMe')}
                size="sm"
                modelValue={formValue.remember}
                onClick={(e) => updateFormState('remember')(e.target.checked)}
                className="!text-black"
              />
            </div>
            <div className="text-right">
              <a
                href={RESET_PASSWORD_ROUTE}
                className="text-sm font-bold text-white hover:underline"
              >
                {t('login.forgotYourPassword')}
              </a>
            </div>
          </div>
        </form>
        <div className="flex flex-wrap justify-center my-6 gap-4">
          {[
            { icon: DiscordIcon, label: 'Discord' },
            { icon: GoogleIcon, label: 'Google' },
          ].map(({ icon: Icon, label }) => (
            <CryButton key={label} className="bg-transparent w-12" circle>
              <div className="flex items-center justify-center">
                <Icon className="h-8 w-8" />
              </div>
            </CryButton>
          ))}
        </div>
        <div className="flex justify-center">
          <CryButton
            circle
            className="bg-green-600 w-52 sm:w-60 text-white"
            onClick={handleSubmit}
          >
            {t('login.title')}
          </CryButton>
        </div>

        <div className="text-center sm:text-base sm:mt-4">
          <a
            href={SIGN_UP_ROUTE}
            className="text-sm text-yellow-600 hover:underline"
          >
            {t('login.doNotHaveAnAccount')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
