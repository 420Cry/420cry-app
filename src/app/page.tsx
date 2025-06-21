import React, { ReactElement } from 'react'
import { useTranslations } from 'next-intl'
import { showToast, SignOutRequestService } from '@/lib'
import { CryButton } from '@420cry/420cry-lib'

export default function Home(): ReactElement {
  const t = useTranslations()

  const logout = async () => {
    try {
      await SignOutRequestService.signOut()
    } catch (error) {
      console.error('Logout failed:', error)
      showToast(false, t('app.alertTitle.somethingWentWrong'))
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-center text-blue-600">
        Logged in 420CRY-APP
      </h1>
      <CryButton onClick={logout}>
        {t('app.buttons.logout') || 'Logout'}
      </CryButton>
    </>
  )
}
