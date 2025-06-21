'use client'

import React, { ReactElement } from 'react'
import { useTranslations } from 'next-intl'
import { showToast, SIGN_IN_ROUTE, SignOutRequestService } from '@/lib'
import { CryButton } from '@420cry/420cry-lib'
import { useRouter } from 'next/navigation'

export default function Home(): ReactElement {
  const t = useTranslations()
  const router = useRouter()
  const logout = async () => {
    try {
      const resposne = await SignOutRequestService.signOut()
      if (resposne.isSuccess) {
        router.push(SIGN_IN_ROUTE)
      }
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
        <CryButton onClick={logout} className="w-full">
          {t('auth.signout.title')}
        </CryButton>
      </div>
    </div>
  )
}
