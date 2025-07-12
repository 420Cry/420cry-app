'use client'

import { ReactElement } from 'react'
import { CrySearchBar, UserIcon } from '@420cry/420cry-lib'
import LanguageChangeButton from '../LanguageChangeButton'
import { useTranslations } from 'next-intl'

export default function DashboardHeader(): ReactElement {
  const t = useTranslations()
  const searchPlaceholder = t('dashboard.search')

  return (
    <header className="relative w-full h-16 flex items-center px-4 sm:px-6">
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg">
        <CrySearchBar
          placeholder={searchPlaceholder}
          width="w-full"
          height="h-10"
          textColor="text-gray-800"
          iconColor="text-gray-400"
          rounded="rounded-full"
          ringColor="focus:ring-transparent"
          className="text-sm"
        />
      </div>
      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        <LanguageChangeButton />
        <UserIcon className="h-7 w-7 sm:h-9 sm:w-9 text-gray-600 cursor-pointer" />
      </div>
    </header>
  )
}
