import { AuthHeader, SignUpForm } from '@/components'
import { JSX } from 'react'

const SignupPage = (): JSX.Element => {
  return (
    <div className="relative items-center min-h-screen ">
      <AuthHeader />
      <SignUpForm />
    </div>
  )
}

export default SignupPage
