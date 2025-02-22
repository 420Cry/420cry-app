'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { CryButton, GoogleIcon, DiscordIcon } from '@420cry/420cry-lib'
import { toast } from 'react-hot-toast'
import { renderFormTextField, showToast } from '@/src/lib'
import { signUp } from '@/src/services'
import { SIGN_IN_ROUTE } from '@/src/constants'
import { useRouter } from 'next/navigation'

const SignupForm: React.FC = () => {
  const t = useTranslations()
  const hideLabel = t('signup.showPassword')
  const showLabel = t('signup.hidePassword')
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    if ([...formData.values()].some((value) => !value)) {
      toast.error(t('app.alertTitle.allfieldsAreRequired'))
      return
    }
    try {
      const response = await signUp(formData)
      showToast(response.success, t(response.message))
      if (response.success) {
        router.push(SIGN_IN_ROUTE)
      }
    } catch (error) {
      console.log(error)
      toast.error(t('app.alertTitle.somethingWentWrong'))
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
              {renderFormTextField({
                label: t('app.fields.fullname'),
                name: 'fullName',
              })}
            </div>
            <div className="w-full sm:w-1/2">
              {renderFormTextField({
                label: t('app.fields.email'),
                name: 'email',
              })}
            </div>
          </div>
          {renderFormTextField({
            label: t('app.fields.username'),
            name: 'userName',
          })}
          {renderFormTextField({
            label: t('app.fields.password'),
            name: 'password',
            type: 'password',
            hideLabel: hideLabel,
            showLabel: showLabel,
          })}
          {renderFormTextField({
            label: t('app.fields.repeatedPassword'),
            name: 'repeatedPassword',
            type: 'password',
            hideLabel: hideLabel,
            showLabel: showLabel,
          })}
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
