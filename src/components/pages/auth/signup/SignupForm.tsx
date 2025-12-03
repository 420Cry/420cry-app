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
  SIGN_IN_ROUTE,
  authService,
  useLoading,
  useNotification,
  useClientOnly,
  formStyles,
  combineStyles,
  HOME_ROUTE,
} from '@/lib'
import { useRouter, useSearchParams } from 'next/navigation'
import { SignUpFormSchema } from '@/lib/server/validation/auth/SignUpFormSchema'
import { OAuthService } from '@/lib/client/auth/oauth/OAuthService'
import { useAuthStore } from '@/store'

const SignupForm = (): JSX.Element => {
  const t = useTranslations()
  const hideLabel = t('app.common.showPassword')
  const showLabel = t('app.common.hidePassword')
  const router = useRouter()
  const { setLoading } = useLoading()
  const { showNotification } = useNotification()
  const _isClient = useClientOnly()
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})

  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') || null
  const fullNameParam = searchParams.get('fullname') || null

  const [isOAuthSignUp, setIsOAuthSignUp] = useState(false)
  const [email, setEmail] = useState(emailParam || '')
  const [fullName, setFullName] = useState(fullNameParam || '')

  useEffect(() => {
    if (emailParam && fullNameParam) {
      setIsOAuthSignUp(true)
    }
  }, [emailParam, fullNameParam])

  const validateFormData = (
    formData: FormData,
  ): { isValid: boolean; errors: Record<string, string> } => {
    const data = {
      fullName: formData.get('fullName') as string,
      userName: formData.get('userName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      repeatedPassword: formData.get('repeatedPassword') as string,
    }

    try {
      SignUpFormSchema.parse(data)
      return { isValid: true, errors: {} }
    } catch (error: unknown) {
      const errors: Record<string, string> = {}
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as {
          errors: Array<{ path: string[]; message: string }>
        }
        zodError.errors.forEach((err) => {
          const field = err.path[0]
          errors[field] = err.message
        })
      }
      return { isValid: false, errors }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    // Clear previous validation errors
    setValidationErrors({})

    // Validate form data using the same schema as backend
    const validation = validateFormData(formData)
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    setLoading(true)
    try {
      const result = await authService.signUp.action.signUpAction(
        formData,
        isOAuthSignUp,
      )
      if ('isSuccess' in result) {
        showNotification(
          result.isSuccess ? 'success' : 'error',
          result.isSuccess
            ? t('auth.signup.successTitle')
            : t('auth.signup.errorTitle'),
          t(result.message),
        )
        if (result.isSuccess) {
          router.push(SIGN_IN_ROUTE)
        }
      } else {
        const { response, user } = result
        const success = response.isSuccess
        const message = user
          ? t(response.message, { fullname: user.fullname })
          : t(response.message)

        if (user) {
          user.rememberMe = false
          useAuthStore.getState().setUser(user)
        }

        showNotification(
          success ? 'success' : 'error',
          success ? t('auth.signup.successTitle') : t('auth.signup.errorTitle'),
          t(message),
        )

        if (success && user) {
          const targetRoute = HOME_ROUTE
          router.push(targetRoute)
        }
      }
    } catch {
      showNotification(
        'error',
        t('auth.signup.errorTitle'),
        t('app.messages.error.general'),
      )
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignUp = (title: string) => {
    if (title === 'Google') {
      OAuthService.handleGoogleService()
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8"
      suppressHydrationWarning
    >
      <div className="p-6 sm:p-12 w-full max-w-[900px] rounded-2xl backdrop-blur-md border border-white/10 max-h-[90vh] overflow-auto">
        <h1 className="text-center text-white text-2xl sm:text-3xl mb-6 sm:mb-8 font-bold">
          {isOAuthSignUp ? t('oauth.signup.title') : t('auth.signup.title')}
        </h1>
        <form onSubmit={handleSubmit} suppressHydrationWarning>
          {/* Name and Email Row */}
          <div className="flex flex-wrap gap-y-5 mb-6">
            <div className="w-full sm:w-1/2 sm:pr-3">
              <CryFormTextField
                label={t('app.fields.fullname')}
                name="fullName"
                inputClassName={combineStyles(
                  formStyles.input.default,
                  formStyles.input.focus,
                )}
                value={fullName}
                onChange={() => setFullName}
              />
              {validationErrors.fullName && (
                <div className="text-red-500 text-sm mt-1">
                  {t(validationErrors.fullName)}
                </div>
              )}
            </div>
            <div className="w-full sm:w-1/2 sm:pl-3">
              <CryFormTextField
                label={t('app.fields.email')}
                name="email"
                inputClassName={combineStyles(
                  formStyles.input.default,
                  formStyles.input.focus,
                )}
                value={email}
                onChange={() => setEmail}
              />
              {validationErrors.email && (
                <div className="text-red-500 text-sm mt-1">
                  {t(validationErrors.email)}
                </div>
              )}
            </div>
          </div>

          {/* Username Field */}
          <div className="mb-6">
            <CryFormTextField
              label={t('app.fields.username')}
              name="userName"
              inputClassName={combineStyles(
                formStyles.input.default,
                formStyles.input.focus,
              )}
            />
            {validationErrors.userName && (
              <div className="text-red-500 text-sm mt-1">
                {t(validationErrors.userName)}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <CryFormTextField
              label={t('app.fields.password')}
              name="password"
              type="password"
              hideLabel={hideLabel}
              showLabel={showLabel}
              inputClassName={combineStyles(
                formStyles.input.default,
                formStyles.input.focus,
              )}
              slotClassName="text-white"
            />
            {validationErrors.password && (
              <div className="text-red-500 text-sm mt-1">
                {t(validationErrors.password)}
              </div>
            )}
          </div>

          {/* Repeat Password Field */}
          <div className="mb-8">
            <CryFormTextField
              label={t('app.fields.repeatedPassword')}
              name="repeatedPassword"
              type="password"
              hideLabel={hideLabel}
              showLabel={showLabel}
              inputClassName={combineStyles(
                formStyles.input.default,
                formStyles.input.focus,
              )}
              slotClassName="text-white"
            />
            {validationErrors.repeatedPassword && (
              <div className="text-red-500 text-sm mt-1">
                {t(validationErrors.repeatedPassword)}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mb-6">
            <CryButton
              shape="circle"
              className="w-full sm:w-64 text-white font-semibold"
              type="submit"
              color="primary"
              size="lg"
            >
              {t('auth.signup.title')}
            </CryButton>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-yellow-600 bg-transparent">
              {t('auth.signup.orSignInUsing')}
            </span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {[GoogleIcon, DiscordIcon].map((Icon, index) => {
            const title = Icon === GoogleIcon ? 'Google' : 'Discord'
            return (
              <CryButton
                key={index}
                size="lg"
                className="bg-transparent w-full sm:w-48"
                shape="circle"
                variant="outline"
                color="primary"
              >
                <div
                  onClick={() => handleOAuthSignUp(title)}
                  className="flex items-center justify-center"
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <span className="text-white">{title}</span>
                </div>
              </CryButton>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SignupForm
