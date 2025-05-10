import { HoneyCombBackground } from '@/components'

const AuthLayout = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement => {
  return <HoneyCombBackground>{children}</HoneyCombBackground>
}

export default AuthLayout
