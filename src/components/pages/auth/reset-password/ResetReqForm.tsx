'use client'

import {
  CryButton,
  CryFormTextField,
  ResetPasswordIcon,
  CryForm,
} from '@420cry/420cry-lib'
import React, { JSX } from 'react'

import { useTranslations } from 'next-intl'
import {
  fieldsRequired,
  SIGN_IN_ROUTE,
  useLoading,
  useNotification,
  useClientOnly,
  formStyles,
  combineStyles,
  useAuthService,
} from '@/lib'
import { useRouter } from 'next/navigation'

const ResetReqForm = (): JSX.Element => {
  const t = useTranslations()
  const router = useRouter()
  const { setLoading } = useLoading()
  const { showNotification } = useNotification()
  const _isClient = useClientOnly()
  const authService = useAuthService()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    if (!fieldsRequired(formData, t)) return

    setLoading(true)
    try {
      const response =
        await authService.resetPassword.request.resetRequestAction(formData)
      showNotification(
        response.isSuccess ? 'success' : 'error',
        response.isSuccess
          ? t('auth.resetYourPassword.resetReq.successTitle')
          : t('auth.resetYourPassword.resetReq.errorTitle'),
        t(response.message),
      )

      if (response.isSuccess) {
        router.push(SIGN_IN_ROUTE)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={combineStyles(formStyles.layout.centerVertical)}
      suppressHydrationWarning
    >
      <CryForm
        variant="card"
        maxWidth="2xl"
        containerClassName="p-8 sm:p-20"
        title={t('auth.resetYourPassword.resetReq.title')}
        subtitle={t('auth.resetYourPassword.resetReq.subtitle')}
        spacing="lg"
        titleClassName="text-3xl sm:text-5xl"
        subtitleClassName="whitespace-pre-line max-w-[500px]"
        onSubmit={handleSubmit}
        formClassName="w-full max-w-[500px] m-auto"
      >
        <div className="w-full flex flex-col items-center gap-12 justify-center mb-6">
          {/* TODO: Forgot Password Icon */}
          <ResetPasswordIcon />
        </div>
        <CryFormTextField
          label={t('app.fields.email')}
          labelClassName="text-neutral-gray-3"
          name="email"
          type="text"
          slotClassName="text-white"
          inputClassName={combineStyles(
            formStyles.input.default,
            formStyles.input.focus,
            'w-full max-w-[500px] focus:border-green-500!',
          )}
        />

        <div className="flex justify-center mt-14">
          <CryButton
            shape="circle"
            type="submit"
            color="primary"
            className="max-w-52 h-12 w-full"
          >
            {t('app.common.confirm')}
          </CryButton>
        </div>
      </CryForm>
    </div>
  )
}

export default ResetReqForm
