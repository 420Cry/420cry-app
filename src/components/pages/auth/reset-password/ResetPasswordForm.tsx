'use client'

import {
  CryButton,
  CryFormTextField,
  ResetPasswordIcon,
} from '@420cry/420cry-lib'
import { JSX } from 'react'

import { useTranslations } from 'next-intl'
import { fieldsRequired, showToast } from '@/lib'
import { ResetPasswordService } from '@/services'
import { useRouter } from 'next/navigation'

const ResetPasswordForm = (): JSX.Element => {
  const t = useTranslations()
  const router = useRouter()
  const showLabel = t('resetYourPassword.resetPasswordForm.showPassword')
  const hideLabel = t('resetYourPassword.resetPasswordForm.hidePassword')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    if (!fieldsRequired(formData, t)) return

    const response = ResetPasswordService.resetPassword(formData)
    showToast(response.isSuccess, t(response.message))
    if (response.isSuccess === true) {
      setTimeout(() => router.push('/auth/login'), 1500)
    }
  }

  return (
    <div className="flex items-center justify-center mt-16 sm:mt-32 px-4">
      <div className="p-8 sm:p-14 w-full max-w-[900px] rounded-2xl backdrop-blur-md border border-white/10 ">
        <div className="w-full flex flex-col items-center gap-12 justify-center">
          <ResetPasswordIcon />

          <div className="mb-8 w-full m-auto">
            <h1 className="text-center text-white text-3xl sm:text-5xl mb-4 sm:mb-6 font-bold">
              {t('resetYourPassword.resetPasswordForm.title')}
            </h1>

            <h2 className="text-white m-auto text-center max-w-[400px] w-full font-bold text-md sm:text-lg">
              {t('resetYourPassword.resetPasswordForm.subtitle')}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-[500px] m-auto">
          <CryFormTextField
            label={t('app.fields.password')}
            labelClassName="text-neutral-gray-3"
            name="password"
            type="password"
            slotClassName="text-white"
            inputClassName="bg-black text-white hover:bg-gray-800 dark:bg-gray-900 w-full max-w-[500px] focus:border-green-500 "
            showLabel={showLabel}
            hideLabel={hideLabel}
          />
          <CryFormTextField
            label={t('app.fields.repeatedPassword')}
            labelClassName="text-neutral-gray-3"
            type="password"
            name="repeatedPassword"
            slotClassName="text-white"
            inputClassName="bg-black text-white hover:bg-gray-800 dark:bg-gray-900 w-full max-w-[500px] focus:border-green-500"
            showLabel={showLabel}
            hideLabel={hideLabel}
          />

          <div className="flex justify-center mt-10">
            <CryButton
              circle
              className="bg-gradient-to-b from-radial-left to-radial-right text-white w-52 h-12 sm:w-48"
              type="submit"
            >
              {t('resetYourPassword.confirm')}
            </CryButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordForm
