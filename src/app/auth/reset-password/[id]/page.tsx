import { AuthHeader } from '@/components'
import { JSX } from 'react'

const ResetPasswordPage = (): JSX.Element => {
  return (
    <div
      className="items-center min-h-screen"
      style={{ background: 'linear-gradient(to right, #F9FAFA, #02AAB0)' }}
    >
      <AuthHeader />
    </div>
  )
}

export default ResetPasswordPage
