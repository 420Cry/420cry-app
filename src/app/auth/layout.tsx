import { JSX, ReactNode } from 'react'
import { HoneyCombBackground } from '@/components'

const AuthLayout = ({ children }: { children: ReactNode }): JSX.Element => {
  return <HoneyCombBackground>{children}</HoneyCombBackground>
}

export default AuthLayout
