import { BackgroundComponent } from '@/src/components'

const AuthLayout = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement => {
  return <BackgroundComponent>{children}</BackgroundComponent>
}

export default AuthLayout
