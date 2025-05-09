import { AuthBackground, bgSelection } from '@/components'

const AuthLayout = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement => {
  const blackHoneyComb = bgSelection.blackHoneyComb

  return (
    <AuthBackground bgSelection={blackHoneyComb}>{children}</AuthBackground>
  )
}

export default AuthLayout
