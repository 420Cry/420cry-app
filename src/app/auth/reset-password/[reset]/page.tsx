import { AuthHeader, ResetPasswordForm } from '@/components'
import { JSX } from 'react'

type Params = Promise<{ reset: string }>

const ResetPasswordPage = async (props: {
  params: Params
}): Promise<JSX.Element> => {
  const { reset } = await props.params

  return (
    <div className="relative items-center min-h-screen">
      <AuthHeader />
      <ResetPasswordForm resetPasswordId={reset} />
    </div>
  )
}

export default ResetPasswordPage
