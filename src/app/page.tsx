'use client'

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
      showToast(false, t('app.alertTitle.somethingWentWrong'))
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-blue-600">
          Logged in 420CRY-APP
        </h1>
        <p className="text-gray-600">{t('auth.signout.prompt')}</p>
        <CryButton onClick={logout} className="w-full">
          {t('auth.signout.title')}
        </CryButton>
      </div>
    </div>
  )
}
