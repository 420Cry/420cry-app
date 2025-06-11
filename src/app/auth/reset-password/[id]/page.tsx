import { AuthHeader, ResetPasswordForm } from '@/components'
import { JSX } from 'react'

const ResetPasswordPage = (): JSX.Element => {
  return (
    <div className="relative items-center min-h-screen">
      <AuthHeader />
      <ResetPasswordForm />
    </div>
  )
}

export default ResetPasswordPage
