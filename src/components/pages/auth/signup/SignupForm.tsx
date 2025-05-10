'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import {
  CryButton,
  GoogleIcon,
  DiscordIcon,
  CryFormTextField,
} from '@420cry/420cry-lib'
import { showToast, SIGN_IN_ROUTE } from '@/lib'
import { useRouter } from 'next/navigation'
import { SignUpService } from '@/services'

const SignupForm: React.FC = () => {
  const t = useTranslations()
  const hideLabel = t('signup.showPassword')
  const showLabel = t('signup.hidePassword')
  const router = useRouter()

  const validateFormData = (formData: FormData): boolean => {
    return [...formData.values()].every((value) => value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    if (!validateFormData(formData)) {
      showToast(false, t('app.alertTitle.allfieldsAreRequired'))
      return
    }
    try {
      const response = await SignUpService.signUpAction(formData)
      showToast(response.isSuccess, t(response.message))
      if (response.isSuccess) {
        router.push(SIGN_IN_ROUTE)
      }
    } catch {
      showToast(false, t('app.alertTitle.somethingWentWrong'))
    }
  }

  return (
    <div className="flex items-center justify-center px-4 py-8 mt-12">
      <div className="p-6 sm:p-12 w-full max-w-[900px] rounded-2xl backdrop-blur-md border border-white/10 max-h-[90vh] overflow-auto">
        <h1 className="text-center text-white text-2xl sm:text-3xl mb-4 sm:mb-6 font-bold">
          {t('signup.title')}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap mb-4">
            <div className="w-full sm:w-1/2 sm:pr-4">
              <CryFormTextField
                label={t('app.fields.fullname')}
                name="fullName"
                inputClassName="bg-black text-white hover:bg-gray-800 dark:bg-gray-900"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <CryFormTextField
                label={t('app.fields.email')}
                name="email"
                inputClassName="bg-black text-white hover:bg-gray-800 dark:bg-gray-900"
              />
            </div>
          </div>
          <CryFormTextField
            label={t('app.fields.username')}
            name="userName"
            inputClassName="bg-black text-white hover:bg-gray-800 dark:bg-gray-900"
          />
          <CryFormTextField
            label={t('app.fields.password')}
            name="password"
            type="password"
            hideLabel={hideLabel}
            showLabel={showLabel}
            inputClassName="bg-black text-white hover:bg-gray-800 dark:bg-gray-900"
            slotClassName="text-white"
          />
          <CryFormTextField
            label={t('app.fields.repeatedPassword')}
            name="repeatedPassword"
            type="password"
            hideLabel={hideLabel}
            showLabel={showLabel}
            inputClassName="bg-black text-white hover:bg-gray-800 dark:bg-gray-900"
            slotClassName="text-white"
          />
          <div className="flex justify-center mt-4">
            <CryButton
              circle
              className="bg-green-600 w-44 sm:w-52 text-white"
              type="submit"
            >
              {t('signup.title')}
            </CryButton>
          </div>
        </form>

        <div className="text-center text-sm sm:text-base mt-6 text-yellow-600">
          {t('signup.orSignInUsing')}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {[GoogleIcon, DiscordIcon].map((Icon, index) => (
            <CryButton
              key={index}
              size="lg"
              className="bg-transparent border-green-600 w-36 sm:w-40"
              circle
              outlined
            >
              <div className="flex items-center justify-center">
                <Icon className="h-5 w-5 mr-2" />
                <span className="text-white">
                  {Icon === GoogleIcon ? 'Google' : 'Discord'}
                </span>
              </div>
            </CryButton>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SignupForm
