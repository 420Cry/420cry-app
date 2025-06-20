import { AuthHeader, ResetPasswordForm } from '@/components'
import { JSX } from 'react'

type Params = Promise<{ resetPasswordID: string }>

const ResetPasswordPage = async (props: {
  params: Params
}): Promise<JSX.Element> => {
  const { resetPasswordID } = await props.params

  return (
    <div className="relative items-center min-h-screen">
      <AuthHeader />
      <ResetPasswordForm resetPasswordID={resetPasswordID} />
    </div>
  )
}

export default ResetPasswordPage
