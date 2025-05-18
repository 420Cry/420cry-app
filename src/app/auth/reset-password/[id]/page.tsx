import { AuthHeader, ResetPasswordForm } from '@/components'
import React from 'react'

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="relative items-center min-h-screen">
      <AuthHeader />
      <ResetPasswordForm />
    </div>
  )
}

export default ResetPasswordPage
