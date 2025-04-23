import { LogInForm, AuthHeader } from '@/src/components'
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
