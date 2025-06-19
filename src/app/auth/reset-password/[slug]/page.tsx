import { AuthHeader, ResetPasswordForm } from '@/components'
import { JSX } from 'react'

type Params = Promise<{ slug: string }>

const ResetPasswordPage = async (props: {
  params: Params
}): Promise<JSX.Element> => {
  const { slug } = await props.params

  return (
    <div className="relative items-center min-h-screen">
      <AuthHeader />
      <ResetPasswordForm slug={slug} />
    </div>
  )
}

export default ResetPasswordPage
