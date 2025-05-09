'use client'

import { AuthHeader, VerifyEmailForm } from '@/components'
import { useSearchParams, notFound } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { VerifyAccountTokenService } from '@/services'
import { useTranslations } from 'next-intl'

const SignUpConfirmationPage: React.FC = () => {
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
    <div
      className="items-center min-h-screen"
      style={{ background: 'linear-gradient(to right, #F9FAFA, #02AAB0)' }}
    >
      <AuthHeader />
      <VerifyEmailForm />
    </div>
  )
}

export default SignUpConfirmationPage
