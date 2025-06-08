import { TwoFactorAuthForm } from '@/components'
import { JSX } from 'react'

const TwoFAPage = (): JSX.Element => {
  return (
    <div className="relative items-center min-h-screen ">
      <TwoFactorAuthForm />
    </div>
  )
}

export default TwoFAPage
