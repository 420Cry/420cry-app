import { AuthHeader, LogInForm } from '@/components'
import React from 'react'

const LoginPage: React.FC = () => {
  return (
    <div className="relative items-center min-h-screen ">
      <AuthHeader isSignUpButton />
      <LogInForm />
    </div>
  )
}

export default LoginPage
