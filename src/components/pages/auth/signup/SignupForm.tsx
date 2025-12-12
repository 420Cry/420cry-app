'use client'

import { JSX, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  CryButton,
  GoogleIcon,
  DiscordIcon,
  CryFormTextField,
  CryForm,
} from '@420cry/420cry-lib'
import {
  SIGN_IN_ROUTE,
  useLoading,
  useNotification,
  useAuthService,
  SignUpFormSchema,
  formStyles,
  combineStyles,
} from '@/lib'
import { useRouter } from 'next/navigation'

const SignupForm = (): JSX.Element => {
  const t = useTranslations()
  const hideLabel = t('app.common.showPassword')
  const showLabel = t('app.common.hidePassword')
  const router = useRouter()
  const { setLoading } = useLoading()
  const { showNotification } = useNotification()
  const authService = useAuthService()
  // Store translation keys instead of translated strings so errors update when language changes
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})

  // Helper function to translate error messages on render
  const getTranslatedError = (errorKey?: string): string | undefined => {
    if (!errorKey) return undefined
    return errorKey.startsWith('app.') ? t(errorKey as any) : errorKey
  }

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

    const result = SignUpFormSchema.safeParse(data)
    if (result.success) {
      return { isValid: true, errors: {} }
    }

    // Store translation keys, not translated strings
    const errors: Record<string, string> = {}
    result.error.issues.forEach((err) => {
      const field = err.path[0] as string
      // Store the translation key (err.message is already a key like 'app.rules.email')
      // or the message itself if it's not a translation key
      errors[field] = err.message
    })
    return { isValid: false, errors }
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
      const response = await authService.signUp.action.signUpAction(formData)
      showNotification(
        response.isSuccess ? 'success' : 'error',
        response.isSuccess
          ? t('auth.signup.successTitle')
          : t('auth.signup.errorTitle'),
        t(response.message),
      )
      if (response.isSuccess) {
        router.push(SIGN_IN_ROUTE)
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

  return (
    <div
      className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8"
      suppressHydrationWarning
    >
      <CryForm
        variant="card"
        maxWidth="2xl"
        containerClassName="max-h-[90vh] overflow-auto"
        title={t('auth.signup.title')}
        spacing="lg"
        onSubmit={handleSubmit}
        formClassName=""
      >
        {/* Name and Email Row */}
        <div className="flex flex-wrap gap-y-5 mb-6">
          <CryFormTextField
            label={t('app.fields.fullname')}
            name="fullName"
            error={getTranslatedError(validationErrors.fullName)}
            wrapperClassName="w-full sm:w-1/2 sm:pr-3"
            labelClassName={formStyles.label.default}
            inputClassName={combineStyles(
              formStyles.input.default,
              formStyles.input.focus,
            )}
          />
          <CryFormTextField
            label={t('app.fields.email')}
            name="email"
            error={getTranslatedError(validationErrors.email)}
            wrapperClassName="w-full sm:w-1/2 sm:pl-3"
            labelClassName={formStyles.label.default}
            inputClassName={combineStyles(
              formStyles.input.default,
              formStyles.input.focus,
            )}
          />
        </div>

        {/* Username Field */}
        <CryFormTextField
          label={t('app.fields.username')}
          name="userName"
          error={getTranslatedError(validationErrors.userName)}
          labelClassName={formStyles.label.default}
          inputClassName={combineStyles(
            formStyles.input.default,
            formStyles.input.focus,
          )}
        />

        {/* Password Field */}
        <CryFormTextField
          label={t('app.fields.password')}
          name="password"
          type="password"
          hideLabel={hideLabel}
          showLabel={showLabel}
          error={getTranslatedError(validationErrors.password)}
          slotClassName="text-white"
          labelClassName={formStyles.label.default}
          inputClassName={combineStyles(
            formStyles.input.default,
            formStyles.input.focus,
          )}
        />

        {/* Repeat Password Field */}
        <CryFormTextField
          label={t('app.fields.repeatedPassword')}
          name="repeatedPassword"
          type="password"
          hideLabel={hideLabel}
          showLabel={showLabel}
          error={getTranslatedError(validationErrors.repeatedPassword)}
          slotClassName="text-white"
          wrapperClassName="mb-8"
          labelClassName={formStyles.label.default}
          inputClassName={combineStyles(
            formStyles.input.default,
            formStyles.input.focus,
          )}
        />

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
          {[GoogleIcon, DiscordIcon].map((Icon, index) => (
            <CryButton
              key={index}
              size="lg"
              className="bg-transparent w-full sm:w-48"
              shape="circle"
              variant="outline"
              color="primary"
            >
              <div className="flex items-center justify-center">
                <Icon className="h-5 w-5 mr-2" />
                <span className="text-white">
                  {Icon === GoogleIcon
                    ? t('auth.signup.oauth.google')
                    : t('auth.signup.oauth.discord')}
                </span>
              </div>
            </CryButton>
          ))}
        </div>
      </CryForm>
    </div>
  )
}

export default SignupForm
