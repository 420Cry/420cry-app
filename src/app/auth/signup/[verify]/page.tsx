'use client'

import { AuthHeader, VerifyEmailForm } from '@/components'
import { useSearchParams, notFound } from 'next/navigation'
import { JSX, useEffect, useState } from 'react'
import { VerifyAccountTokenService } from '@/services'
import { useTranslations } from 'next-intl'

const SignUpConfirmationPage = (): JSX.Element => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const t = useTranslations()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  )

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    const verifyToken = async () => {
      const response = await VerifyAccountTokenService.verifyToken(token)
      if (response.isSuccess) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    }

    verifyToken()
  }, [token])

  // If error (invalid token or no token), show 404 page
  if (status === 'error') {
    notFound()
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-700">{t('signup.verifyEmail.title')}</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <AuthHeader />
      <VerifyEmailForm />
    </div>
  )
}

export default SignUpConfirmationPage
