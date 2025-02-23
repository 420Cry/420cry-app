import { AuthHeader, SignUpForm } from '@/src/components'
import React from 'react'

const SignupPage: React.FC = () => {
  return (
    <div
      className="items-center min-h-screen"
      style={{ background: 'linear-gradient(to right, #F9FAFA, #02AAB0)' }}
    >
      <AuthHeader />
      <SignUpForm />
    </div>
  )
}

export default SignupPage
