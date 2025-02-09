'use client'
import {
  CryButton,
  CryCheckBox,
  DiscordIcon,
  GoogleIcon,
} from '@420cry/420cry-lib'
import React, { useState } from 'react'
import { useAlert } from '@/src/context/AlertContext'
import { formValidate, showAlert, renderFormTextField } from '@/src/utils'
import { ISignIn } from '@/src/types'
import { RESET_PASSWORD_ROUTE, SIGN_UP_ROUTE } from '@/src/constants/routes'
import { useTranslations } from 'next-intl'

const initialFormValue: ISignIn = {
  username: '',
  password: '',
  remember: false,
}

const LoginForm: React.FC = () => {
  const [formValue, setFormValue] = useState<ISignIn>(initialFormValue)
  const { setAlert } = useAlert()
  const t = useTranslations()

  const updateFormState = (key: keyof ISignIn) => (value: string | boolean) =>
    setFormValue((prev) => ({ ...prev, [key]: value }))

  const formValidateHandler = (): boolean => {
    const validations: Array<(data: ISignIn) => boolean> = [
      (data) => {
        if (!data.username || !data.password) {
          showAlert(
            'danger',
            'Both username and password are required.',
            setAlert,
          )
          return false
        }
        return true
      },
    ]

    return formValidate(formValue, validations, setAlert)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formValue)
    if (formValidateHandler()) {
      // TODO: Login action
      showAlert('success', 'Login successful!', setAlert)
    }
  }

  return (
    <div className="flex items-center justify-center mt-16 sm:mt-32 px-4">
      <div className="bg-transparent p-8 sm:p-16 w-full sm:w-5/12 rounded-2xl shadow-lg">
        <h1 className="text-center text-2xl sm:text-3xl mb-6 sm:mb-10 font-bold">
          {t('login.login')}
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
            {t('login.login')}
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
