'use client'

import {
  CryButton,
  CryFormTextField,
  ResetPasswordIcon,
} from '@420cry/420cry-lib'
import React, { JSX } from 'react'

import { useTranslations } from 'next-intl'
import {
  fieldsRequired,
  showToast,
  ResetRequestService,
  SIGN_IN_ROUTE,
} from '@/lib'
import { useRouter } from 'next/navigation'

const ResetReqForm = (): JSX.Element => {
  const t = useTranslations()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    if (!fieldsRequired(formData, t)) return

    const response = await ResetRequestService.resetRequestAction(formData)
    showToast(response.isSuccess, t(response.message))

    if (response.isSuccess) {
      router.push(SIGN_IN_ROUTE)
    }
  }

  return (
    <div className="flex items-center justify-center mt-16 sm:mt-32 px-4">
      <div className="p-8 sm:p-20 w-full max-w-[900px] rounded-2xl backdrop-blur-md border border-white/10 ">
        <div className="w-full flex flex-col items-center gap-12 justify-center">
          {/* TODO: Forgot Password Icon */}
          <ResetPasswordIcon />

          <div className="mb-8 w-full m-auto">
            <h1 className="text-center text-white text-3xl sm:text-5xl mb-4 sm:mb-6 font-bold">
              {t('resetYourPassword.resetReq.title')}
            </h1>

            <h2
              className="text-white m-auto text-center whitespace-pre-line
              max-w-[500px] w-full font-bold text-md sm:text-lg"
            >
              {t('resetYourPassword.resetReq.subtitle')}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-[500px] m-auto">
          <CryFormTextField
            label={t('app.fields.email')}
            labelClassName="text-neutral-gray-3"
            name="email"
            type="text"
            slotClassName="text-white"
            inputClassName="bg-black text-white hover:bg-gray-800 dark:bg-gray-900 w-full max-w-[500px] focus:border-green-500! "
          />

          <div className="flex justify-center mt-14">
            <CryButton
              circle
              type="submit"
              color="primary"
              className="max-w-52 h-12 w-full"
            >
              {t('app.common.confirm')}
            </CryButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetReqForm
