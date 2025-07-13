'use client'

import { ReactElement, useState } from 'react'
import { CrySearchBar, UserIcon } from '@420cry/420cry-lib'
import LanguageChangeButton from '../LanguageChangeButton'
import { useTranslations } from 'next-intl'
import { SearchInput } from '@/types'
import { resolveSearchInputType, showToast, TransactionService } from '@/lib'

export default function DashboardHeader(): ReactElement {
  const t = useTranslations()
  const searchPlaceholder = t('dashboard.search')
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const input: SearchInput = resolveSearchInputType(searchTerm)

    switch (input.type) {
      case 'TXID':
        try {
          const data = await TransactionService.getTransaction({
            txid: input.txid,
          })

          showToast(
            data.isSuccess,
            t(data.message, {
              blockHeight: data.data?.updated_to_block ?? 'unknown',
            }),
          )
        } catch (error) {
          showToast(
            false,
            error instanceof Error ? error.message : String(error),
          )
        }
        break
      case 'XPUB':
        //console.log('Search XPUB:', input.xpub)
        break
      case 'SYMBOL':
        //console.log('Search Symbol:', input.symbol)
        break
      case 'FULL_NAME':
        //console.log('Search Full Name:', input.fullName)
        break
      case 'UNKNOWN':
      default:
      //console.warn('Unknown search type:', input.raw)
    }
  }

  return (
    <header className="relative w-full h-16 flex items-center px-4 sm:px-6">
      <form
        onSubmit={handleSearchSubmit}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg"
      >
        <CrySearchBar
          placeholder={searchPlaceholder}
          width="w-full"
          height="h-10"
          textColor="text-gray-800"
          iconColor="text-gray-400"
          rounded="rounded-full"
          ringColor="focus:ring-transparent"
          className="text-sm"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </form>
      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        <LanguageChangeButton />
        <UserIcon className="h-7 w-7 sm:h-9 sm:w-9 text-gray-600 cursor-pointer" />
      </div>
    </header>
  )
}
