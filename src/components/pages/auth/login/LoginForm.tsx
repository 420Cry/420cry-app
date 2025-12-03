'use client'

import {
  CryButton,
  CryCheckBox,
  CryFormTextField,
  DiscordIcon,
  GoogleIcon,
} from '@420cry/420cry-lib'
import { JSX, ComponentType } from 'react'
import { useTranslations } from 'next-intl'
import {
  HOME_ROUTE,
  RESET_PASSWORD_ROUTE,
  SIGN_UP_ROUTE,
  authService,
  TWO_FACTOR_SETUP_ROUTE,
  useFormValidation,
  formStyles,
  useLoading,
  combineStyles,
  useNotification,
  useClientOnly,
} from '@/lib'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'
// import { OAuthService } from '@/lib/client/auth/oauth/OAuthService'

const SocialButton = ({
  Icon,
  label,
}: {
  Icon: ComponentType<{ className?: string }>
  label: string
}): JSX.Element => (
  <CryButton key={label} className="bg-transparent w-12" shape="circle">
    <div className="flex items-center justify-center">
      <Icon className="h-8 w-8" />
    </div>
  </CryButton>
)

const LogInForm = (): JSX.Element => {
  const router = useRouter()
  const t = useTranslations()
  const hideLabel = t('app.common.showPassword')
  const showLabel = t('app.common.hidePassword')
  const { handleFormSubmission } = useFormValidation()
  const { setLoading } = useLoading()
  const { showNotification } = useNotification()
  const _isClient = useClientOnly()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    setLoading(true)
    await handleFormSubmission(formData, async (formData) => {
      const { response, user } = await authService.signIn.signInAction(formData)
      const success = response.isSuccess
      const message = user
        ? t(response.message, { fullname: user.fullname })
        : t(response.message)

      const rememberMe = formData.get('rememberMe') === 'on'

      if (user) {
        user.rememberMe = rememberMe
        useAuthStore.getState().setUser(user)
      }

      if (success && user) {
        const targetRoute = user.twoFAEnabled
          ? HOME_ROUTE
          : TWO_FACTOR_SETUP_ROUTE
        router.push(targetRoute)
      }

      showNotification(
        success ? 'success' : 'error',
        success ? t('auth.login.successTitle') : t('auth.login.errorTitle'),
        message,
      )
      return { response, user }
    })
    setLoading(false)
  }

  // const handleOAuthSignIn = (label: string) => {
  //   if (label === 'Google') {
  //     OAuthService.handleGoogleService()
  //   }
  // }

  return (
    <div
      className={combineStyles(formStyles.layout.centerVertical)}
      suppressHydrationWarning
    >
      <div className={formStyles.container.card}>
        <h1 className={formStyles.text.title}>{t('auth.login.title')}</h1>

        <form onSubmit={handleSubmit} suppressHydrationWarning>
          <CryFormTextField
            label={t('app.fields.username')}
            labelClassName={formStyles.label.default}
            name="userName"
            inputClassName={combineStyles(
              formStyles.input.default,
              formStyles.input.focus,
            )}
          />
          <CryFormTextField
            label={t('app.fields.password')}
            labelClassName={formStyles.label.default}
            name="password"
            type="password"
            hideLabel={hideLabel}
            showLabel={showLabel}
            slotClassName="text-white"
            inputClassName={combineStyles(
              formStyles.input.default,
              formStyles.input.focus,
            )}
          />

          <div className={formStyles.layout.spaceBetween}>
            <div className="inline-flex items-center text-left">
              <CryCheckBox
                text={t('auth.login.rememberMe')}
                size="sm"
                className="!text-sm"
                modelValue={false}
                name="rememberMe"
              />
            </div>
            <div className="text-right mb-1">
              <a href={RESET_PASSWORD_ROUTE} className={formStyles.text.link}>
                {t('auth.login.forgotYourPassword')}
              </a>
            </div>
          </div>

          <div
            className={combineStyles(
              formStyles.layout.centerHorizontal,
              formStyles.spacing.large,
            )}
          >
            <CryButton
              shape="circle"
              className={formStyles.button.submit}
              type="submit"
            >
              {t('auth.login.title')}
            </CryButton>
          </div>
        </form>

        <div className="flex flex-wrap justify-center my-6 gap-4">
          {[
            { icon: GoogleIcon, label: 'Google' },
            { icon: DiscordIcon, label: 'Discord' },
          ].map(({ icon, label }) => (
            <SocialButton
              key={label}
              Icon={icon}
              label={label}
            />
          ))}
        </div>
        <div className="text-center sm:text-base sm:mt-4">
          <a
            href={SIGN_UP_ROUTE}
            className="text-sm text-yellow-600 hover:underline"
          >
            {t('auth.login.doNotHaveAnAccount')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default LogInForm
