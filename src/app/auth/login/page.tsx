import { LogInForm, AuthHeader } from '@/src/components'
import React from 'react'

const LoginPage: React.FC = () => {
  return (
    <div className="items-center min-h-screen ">
      <AuthHeader signUp />
      <LogInForm />
    </div>
  )
}

export default LoginPage
