'use client'

import { JSX, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  CryButton,
  GoogleIcon,
  DiscordIcon,
  CryFormTextField,
} from '@420cry/420cry-lib'
import {
  showToast,
  SIGN_IN_ROUTE,
  SignUpService,
  TWO_FACTOR_SETUP_ROUTE,
} from '@/lib'
import { useRouter, useSearchParams } from 'next/navigation'
import { OAuthService } from '@/lib/client/auth/oauth/OAuthService'
import { useAuthStore } from '@/store'

const SignupForm = (): JSX.Element => {
  const t = useTranslations()
  const hideLabel = t('app.common.showPassword')
  const showLabel = t('app.common.hidePassword')
  const router = useRouter()

  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') || null
  const fullNameParam = searchParams.get('fullname') || null

  const [isOAuthSignUp, setIsOAuthSignUp] = useState(false)
  const [email, setEmail] = useState(emailParam || null)
  const [fullName, setFullName] = useState(fullNameParam || null)

  useEffect(() => {
    if (emailParam && fullNameParam) {
      setIsOAuthSignUp(true)
    }
  }, [emailParam, fullNameParam])

  const validateFormData = (formData: FormData): boolean => {
    return [...formData.values()].every((value) => value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    if (email && fullName) {
      formData.append('email', email)
      formData.append('fullName', fullName)
    }

    if (!validateFormData(formData) || email === '' || fullName === '') {
      showToast(false, t('app.alertTitle.allfieldsAreRequired'))
      return
    }

    try {
      const result = await SignUpService.signUpAction(formData, isOAuthSignUp)
      const { response, user } = result
      const success = response.isSuccess
      const message = user
        ? t(response.message, { fullname: user.fullname })
        : t(response.message)

      if (success) {
        if (!user) {
          router.push(SIGN_IN_ROUTE)
        }

        if (user && !user.twoFAEnabled) {
          user.rememberMe = false
          useAuthStore.getState().setUser(user)
          router.push(TWO_FACTOR_SETUP_ROUTE)
        }
      }

      showToast(success, message)
    } catch {
      showToast(false, t('app.alertTitle.somethingWentWrong'))
    }
  }

  const handleOAuthSignUp = (index: number) => {
    // TODO: Fix magic number
    if (index === 0) {
      OAuthService.handleGoogleService()
    }
  }

  return (
    <div className="flex items-center justify-center px-4 py-8 mt-12">
      <div className="p-6 sm:p-12 w-full max-w-[900px] rounded-2xl backdrop-blur-md border border-white/10 max-h-[90vh] overflow-auto">
        <h1 className="text-center text-white text-2xl sm:text-3xl mb-4 sm:mb-6 font-bold">
          {isOAuthSignUp ? t('oauth.signup.title') : t('auth.signup.title')}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap mb-4">
            <div className="w-full sm:w-1/2 sm:pr-4">
              <CryFormTextField
                label={t('app.fields.fullname')}
                name="fullName"
                inputClassName="bg-black text-white hover:bg-gray-800 dark:bg-gray-900"
                value={fullName ? fullName : ''}
                onChange={(fullNameParam) => setFullName(fullNameParam)}
              />
            </div>
            <div className="w-full sm:w-1/2">
              <CryFormTextField
                label={t('app.fields.email')}
                name="email"
                inputClassName="bg-black text-white hover:bg-gray-800 dark:bg-gray-900"
                value={email ? email : ''}
                onChange={(email) => setEmail(email)}
                disabled={email ? true : false}
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
              className=" w-44 sm:w-52 text-white"
              type="submit"
              color="primary"
            >
              {isOAuthSignUp
                ? t('oauth.signup.button')
                : t('auth.signup.title')}
            </CryButton>
          </div>
        </form>

        {!isOAuthSignUp && (
          <>
            <div className="text-center text-sm sm:text-base mt-6 text-yellow-600">
              {t('auth.signup.orSignInUsing')}
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {[GoogleIcon, DiscordIcon].map((Icon, index) => (
                <CryButton
                  key={index}
                  size="lg"
                  className="bg-transparen w-36 sm:w-40"
                  circle
                  outlined
                  color="primary"
                  onClick={() => handleOAuthSignUp(index)}
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
          </>
        )}
      </div>
    </div>
  )
}

export default SignupForm
