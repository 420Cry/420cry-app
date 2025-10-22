'use client'

import { JSX, ReactNode } from 'react'
import { HoneyCombBackground, Loader } from '@/components'
import { LoadingProvider, useLoading } from '@/lib'

function AuthLayoutContent({ children }: { children: ReactNode }) {
  const { loading } = useLoading()

  return (
    <HoneyCombBackground>
      {children}
      <Loader show={loading} />
    </HoneyCombBackground>
  )
}

const AuthLayout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <LoadingProvider>
      <AuthLayoutContent>{children}</AuthLayoutContent>
    </LoadingProvider>
  )
}

export default AuthLayout
