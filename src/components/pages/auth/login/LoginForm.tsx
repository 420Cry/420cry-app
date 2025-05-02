'use client'

import {
  CryButton,
  CryCheckBox,
  CryFormTextField,
  DiscordIcon,
  GoogleIcon,
} from '@420cry/420cry-lib'
import React from 'react'

import { useTranslations } from 'next-intl'
import { RESET_PASSWORD_ROUTE, showToast, SIGN_UP_ROUTE } from '@/lib'
import { SignInService } from '@/services/auth/signin/SignInService'

const SocialButton = ({
  Icon,
  label,
}: {
  Icon: React.ComponentType<{ className?: string }>
  label: string
}) => (
  <CryButton key={label} className="bg-transparent w-12" circle>
    <div className="flex items-center justify-center">
      <Icon className="h-8 w-8" />
    </div>
  </CryButton>
)

const LogInForm: React.FC = () => {
  const t = useTranslations()
  const hideLabel = t('login.showPassword')
  const showLabel = t('login.hidePassword')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    if ([...formData.values()].some((value) => !value)) {
      showToast(false, t('app.alertTitle.allfieldsAreRequired'))
      return
    }
    try {
      const response = SignInService.signInAction(formData)
      showToast(response.isSuccess, t(response.message))
    } catch (error) {
      console.log(error)
      showToast(false, t('app.alertTitle.somethingWentWrong'))
    }
  }

  return (
    <div className="flex items-center justify-center mt-16 sm:mt-32 px-4">
      <div className="bg-transparent p-8 sm:p-16 w-full sm:w-5/12 rounded-2xl shadow-lg">
        <h1 className="text-center text-2xl sm:text-3xl mb-6 sm:mb-10 font-bold">
          {t('login.title')}
        </h1>
        <form onSubmit={handleSubmit}>
          <CryFormTextField label={t('app.fields.username')} name="userName" />
          <CryFormTextField
            label={t('app.fields.password')}
            name="password"
            type="password"
            hideLabel={hideLabel}
            showLabel={showLabel}
          />
          <div className="flex justify-between w-full">
            <div className="text-left">
              <CryCheckBox
                text={t('login.rememberMe')}
                size="sm"
                className="!text-black"
                modelValue={false}
                name="rememberMe"
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

          <div className="flex justify-center my-6">
            <CryButton
              circle
              className="bg-green-600 w-52 sm:w-60 text-white"
              type="submit"
            >
              {t('login.title')}
            </CryButton>
          </div>
        </form>

        <div className="flex flex-wrap justify-center my-6 gap-4">
          {[
            { icon: GoogleIcon, label: 'Google' },
            { icon: DiscordIcon, label: 'Discord' },
          ].map(({ icon, label }) => (
            <SocialButton key={label} Icon={icon} label={label} />
          ))}
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

export default LogInForm
