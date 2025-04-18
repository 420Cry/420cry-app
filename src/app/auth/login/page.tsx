import { LogInForm, AuthHeader } from '@/src/components'
import React from 'react'

const LoginPage: React.FC = () => {
  return (
    <div
      className="items-center min-h-screen"
      style={{ background: 'linear-gradient(to right, #F9FAFA, #02AAB0)' }}
    >
      <AuthHeader isSignUpButton />
      <LogInForm />
    </div>
  )
}

export default LoginPage
