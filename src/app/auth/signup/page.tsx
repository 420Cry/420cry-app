import { AuthHeader, SignUpForm } from '@/components'
import React from 'react'

const SignupPage: React.FC = () => {
  return (
    <div
      className="relative items-center min-h-screen "
    >
      <AuthHeader />
      <SignUpForm />
    </div>
  )
}

export default SignupPage
