import { TwoFASetupForm } from '@/components'
import { JSX } from 'react'

const LoginPage = (): JSX.Element => {
  return (
    <div className="relative items-center min-h-screen ">
      <TwoFASetupForm />
    </div>
  )
}

export default LoginPage
