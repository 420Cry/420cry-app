import { AuthHeader, LogInForm } from '@/components'
import { JSX } from 'react'

const LoginPage = (): JSX.Element => {
  return (
    <div className="relative items-center min-h-screen ">
      <AuthHeader isSignUpButton />
      <LogInForm />
    </div>
  )
}

export default LoginPage
