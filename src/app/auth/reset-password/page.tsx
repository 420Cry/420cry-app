import { AuthHeader, ResetReqForm } from '@/components'
import React from 'react'

const ResetPage: React.FC = () => {
  return (
    <div className="relative items-center min-h-screen">
      <AuthHeader />
      <ResetReqForm />
    </div>
  )
}

export default ResetPage
