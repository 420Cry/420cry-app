import { AuthHeader, ResetPasswordForm } from '@/components'
import { JSX } from 'react'

type Params = Promise<{ id: string }>

const ResetPasswordPage = async (props: {
  params: Params
}): Promise<JSX.Element> => {
  const { id } = await props.params

  return (
    <div className="relative items-center min-h-screen">
      <AuthHeader />
      <ResetPasswordForm id={id} />
    </div>
  )
}

export default ResetPasswordPage
