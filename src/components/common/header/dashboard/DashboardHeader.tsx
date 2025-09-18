'use client'

import { JSX, useState } from 'react'
import { CrySearchBar, UserIcon } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'

import LanguageChangeButton from '../LanguageChangeButton'
import {
  resolveSearchInputType,
  showToast,
  externalService,
  useModal,
} from '@/lib'

import { SearchInput } from '@/types'

interface DashboardHeaderProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DashboardHeader({
  setLoading,
}: DashboardHeaderProps): JSX.Element {
  const t = useTranslations()
  const searchPlaceholder = t('dashboard.search')
  const [searchTerm, setSearchTerm] = useState('')
  const { openModal } = useModal()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input: SearchInput = resolveSearchInputType(searchTerm)

    switch (input.type) {
      case 'TXID': {
        setLoading(true)
        try {
          const response =
            await externalService.walletExplorer.searchTransaction.getTransaction(
              input.txid,
            )

          if (response.isSuccess && response.data) {
            openModal({ type: 'transaction', data: response.data })
          } else {
            openModal({ type: null, data: null })
          }

          showToast(response.isSuccess, t(response.message))
        } catch (error) {
          showToast(
            false,
            error instanceof Error ? error.message : String(error),
          )
          openModal({ type: null, data: null })
        } finally {
          setLoading(false)
        }
        break
      }

      case 'XPUB': {
        setLoading(true)
        try {
          const response =
            await externalService.walletExplorer.searchTransaction.getTransactionByXPUB(
              input.xpub,
            )

          if (response.isSuccess && response.data) {
            openModal({ type: 'xpubTransaction', data: response.data })
          } else {
            openModal({ type: null, data: null })
          }

          showToast(response.isSuccess, t(response.message))
        } catch (error) {
          showToast(
            false,
            error instanceof Error ? error.message : String(error),
          )
          openModal({ type: null, data: null })
        } finally {
          setLoading(false)
        }
        break
      }

      default:
        showToast(false, t('dashboard.alert.invalidInput'))
        break
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
