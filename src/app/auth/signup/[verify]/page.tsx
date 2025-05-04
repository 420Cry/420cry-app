'use client'

import { AuthHeader, NotFound, VerifyEmailForm } from '@/components'
import { useSearchParams, notFound } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { VerifyEmailTokenService } from '@/services'

const SignUpConfirmationPage: React.FC = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [isVerified, setIsVerified] = useState<boolean | null>(null)

  useEffect(() => {
    if (!token) {
      notFound()
    }

    const verifyToken = async () => {
      console.log('Verifying token:', token)
      const response = await VerifyEmailTokenService.verifyToken(token)
      console.log('Token verification response:', response)

      if (response.isSuccess) {
        setIsVerified(true)
      } else {
        notFound()
      }
    }

    verifyToken()
  }, [token])

  if (isVerified === null) {
    return <NotFound />
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
