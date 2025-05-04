'use client'

import { CryButton } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import React from 'react'

const NotFound: React.FC = () => {
  const t = useTranslations()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">
        {t('notFound.title')}
      </h1>
      <p className="text-lg text-gray-600 mb-6">{t('notFound.message')}</p>
      <CryButton to="/" circle className="w-full max-w-xs">
        Go back home
      </CryButton>
    </div>
  )
}

export default NotFound
