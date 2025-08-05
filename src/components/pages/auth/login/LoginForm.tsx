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
  showToast,
  SIGN_UP_ROUTE,
  SignInService,
  TWO_FACTOR_SETUP_ROUTE,
} from '@/lib'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'
import { OAuthService } from '@/lib/client/auth/oauth/OAuthService'

const SocialButton = ({
  Icon,
  label,
  onClick,
}: {
  Icon: ComponentType<{ className?: string }>
  label: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
}): JSX.Element => (
  <CryButton
    onClick={onClick}
    key={label}
    className="bg-transparent w-12"
    circle
  >
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    if ([...formData.values()].some((value) => !value)) {
      showToast(false, t('app.alertTitle.allfieldsAreRequired'))
      return
    }
    try {
      const { response, user } = await SignInService.signInAction(formData)
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

      showToast(success, message)
    } catch {
      showToast(false, t('app.alertTitle.somethingWentWrong'))
    }
  }

  const handleOAuthSignIn = (label: string) => {
    if (label === 'Google') {
      OAuthService.handleGoogleService()
    }
  }

  return (
    <div className="flex items-center justify-center mt-16 sm:mt-32 px-4">
      <div className="p-8 sm:p-24 w-full max-w-[900px] rounded-2xl backdrop-blur-md border border-white/10 ">
        <h1 className="text-center text-white text-2xl sm:text-3xl mb-4 sm:mb-6 font-bold">
          {t('auth.login.title')}
        </h1>

        <form onSubmit={handleSubmit}>
          <CryFormTextField
            label={t('app.fields.username')}
            labelClassName="text-neutral-gray-3"
            name="userName"
            inputClassName="bg-black text-white hover:bg-gray-800 dark:bg-gray-900"
          />
          <CryFormTextField
            label={t('app.fields.password')}
            labelClassName="text-neutral-gray-3"
            name="password"
            type="password"
            hideLabel={hideLabel}
            showLabel={showLabel}
            slotClassName="text-white"
            inputClassName="bg-black text-white hover:bg-gray-800 dark:bg-gray-900"
          />

          <div className="flex justify-between w-full">
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
              <a
                href={RESET_PASSWORD_ROUTE}
                className="text-sm font-bold text-white hover:underline"
              >
                {t('auth.login.forgotYourPassword')}
              </a>
            </div>
          </div>

          <div className="flex justify-center my-6">
            <CryButton
              circle
              className="bg-green-600 w-52 sm:w-60 text-white"
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
              onClick={() => handleOAuthSignIn(label)}
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
