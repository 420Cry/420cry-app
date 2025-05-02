import { SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '@/lib'
import { CryButton } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import React from 'react'

interface AuthHeaderProps {
  isSignUpButton?: boolean
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ isSignUpButton = false }) => {
  const t = useTranslations()

  return (
    <div className="flex justify-between items-center flex-col sm:flex-row sm:justify-between sm:items-center px-4 py-6">
      <strong className="text-green-600 text-2xl sm:text-3xl">
        {t('app.appTitle')}
      </strong>
      <div className="flex flex-col sm:flex-row sm:items-center mt-6 sm:mt-0">
        <CryButton
          circle
          className="bg-transparent mb-4 sm:mb-0 sm:mr-2 w-52 h-12"
        >
          {t('header.menu')}
        </CryButton>
        {isSignUpButton ? (
          <CryButton
            to={SIGN_UP_ROUTE}
            circle
            className="w-52 h-12 text-green-800 sm:mr-2"
            color="success"
            outlined
          >
            {t('header.signUp')}
          </CryButton>
        ) : (
          <CryButton
            to={SIGN_IN_ROUTE}
            circle
            className="w-60 h-12 sm:mr-2 text-green-800"
            color="success"
            outlined
          >
            {t('header.alreadyHasAnAccount')}
          </CryButton>
        )}
      </div>
    </div>
  )
}

export default AuthHeader
