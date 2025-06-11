import { AuthHeader, ResetReqForm } from '@/components'
import { JSX } from 'react'

const ResetPage = (): JSX.Element => {
  return (
    <div className="relative items-center min-h-screen">
      <AuthHeader />
      <ResetReqForm />
    </div>
  )
}

export default ResetPage
