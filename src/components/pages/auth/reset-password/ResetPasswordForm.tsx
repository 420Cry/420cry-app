'use client'

import {
  CryButton,
  CryFormTextField,
  CryForm,
  ResetPasswordIcon,
} from '@420cry/420cry-lib'
import { JSX } from 'react'

import { useTranslations } from 'next-intl'
import {
  fieldsRequired,
  SIGN_IN_ROUTE,
  useLoading,
  useNotification,
  formStyles,
  combineStyles,
  useAuthService,
} from '@/lib'
import { useRouter } from 'next/navigation'

const ResetPasswordForm = ({
  resetPasswordId,
}: {
  resetPasswordId: string
}): JSX.Element => {
  const t = useTranslations()
  const router = useRouter()
  const { setLoading } = useLoading()
  const { showNotification } = useNotification()
  const authService = useAuthService()
  const showLabel = t('app.common.showPassword')
  const hideLabel = t('app.common.hidePassword')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    if (!fieldsRequired(formData, t)) return

    setLoading(true)
    try {
      const response =
        await authService.resetPassword.verify.verifyResetPasswordAction(
          formData,
          resetPasswordId,
        )

      showNotification(
        response.isSuccess ? 'success' : 'error',
        response.isSuccess
          ? t('auth.resetYourPassword.resetPasswordForm.successTitle')
          : t('auth.resetYourPassword.resetPasswordForm.errorTitle'),
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
        containerClassName="max-w-[900px]"
        title={t('auth.resetYourPassword.resetPasswordForm.title')}
        subtitle={t('auth.resetYourPassword.resetPasswordForm.subtitle')}
        spacing="lg"
        titleClassName="text-3xl sm:text-5xl"
        onSubmit={handleSubmit}
        formClassName="w-full max-w-[500px] m-auto"
      >
        <div className="w-full flex flex-col items-center gap-12 justify-center mb-6">
          <ResetPasswordIcon />
        </div>
        <CryFormTextField
          label={t('app.fields.password')}
          labelClassName="text-neutral-gray-3"
          name="newPassword"
          type="password"
          slotClassName="text-white"
          inputClassName={combineStyles(
            formStyles.input.default,
            formStyles.input.focus,
            'w-full max-w-[500px] focus:border-green-500',
          )}
          showLabel={showLabel}
          hideLabel={hideLabel}
        />
        <CryFormTextField
          label={t('app.fields.repeatedPassword')}
          labelClassName="text-neutral-gray-3"
          type="password"
          name="repeatedPassword"
          slotClassName="text-white"
          inputClassName={combineStyles(
            formStyles.input.default,
            formStyles.input.focus,
            'w-full max-w-[500px] focus:border-green-500',
          )}
          showLabel={showLabel}
          hideLabel={hideLabel}
        />

        <div className="flex justify-center mt-10">
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

export default ResetPasswordForm
