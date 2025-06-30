'use client'

import { HOME_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '@/lib'
import cryApplicationLogo from '@/../public/logo/CryApplicationLogo.png'
import { CryButton } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import { JSX } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import LanguageChangeButton from '../common/header/LanguageChangeButton'

interface AuthHeaderProps {
  isSignUpButton?: boolean
}

const AuthHeader = ({
  isSignUpButton = false,
}: AuthHeaderProps): JSX.Element => {
  const t = useTranslations()
  const router = useRouter()

  return (
    <div className="flex justify-between items-center flex-col sm:flex-row sm:items-center px-12 py-6">
      <Image
        src={cryApplicationLogo}
        alt="dark mode logo"
        width={143}
        height={58}
        className="cursor-pointer"
        onClick={() => router.push(HOME_ROUTE)}
        priority
      />
      <div className="flex flex-col gap-12 sm:flex-row sm:items-center mt-6 sm:mt-0">
        <LanguageChangeButton />
        {isSignUpButton ? (
          <CryButton
            circle
            className="w-52 h-12"
            color="primary"
            outlined
            to={SIGN_UP_ROUTE}
          >
            {t('header.signUp')}
          </CryButton>
        ) : (
          <CryButton
            circle
            className="w-60 h-12 sm:mr-2"
            color="primary"
            outlined
            to={SIGN_IN_ROUTE}
          >
            {t('header.alreadyHasAnAccount')}
          </CryButton>
        )}
      </div>
    </div>
  )
}

export default AuthHeader
