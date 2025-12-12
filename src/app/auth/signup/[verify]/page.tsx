'use client'

import { AuthHeader, VerifyEmailForm } from '@/components'
import { useSearchParams, notFound } from 'next/navigation'
import { JSX, useEffect, useState } from 'react'
import { useAuthService } from '@/lib'
import { useTranslations } from 'next-intl'
import { IVerifyAccountToken } from '@/types'

const SignUpConfirmationPage = (): JSX.Element => {
  const searchParams = useSearchParams()
  const token = searchParams?.get('token') ?? null
  const t = useTranslations()
  const authService = useAuthService()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  )

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    const verifyToken = async () => {
      const payload: IVerifyAccountToken = {
        token: token,
      }
      const response =
        await authService.signUp.verifyAccount.verifyToken(payload)
      setStatus(response.isSuccess ? 'success' : 'error')
    }

    verifyToken()
  }, [token, authService])

  if (status === 'error') {
    notFound()
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-700 dark:text-gray-200">
          {t('auth.signup.verifyEmail.title')}
        </p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <AuthHeader />
      <VerifyEmailForm userToken={token!} />
    </div>
  )
}

export default SignUpConfirmationPage
