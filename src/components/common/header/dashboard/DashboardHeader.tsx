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
  const searchPlaceholder = t('dashboard.search.searchPlayholder')
  const [searchTerm, setSearchTerm] = useState('')
  const { openModal } = useModal()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Check if input is empty
    if (!searchTerm.trim()) {
      showToast(false, t('app.alertTitle.emptyInput'))
      return
    }
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
        showToast(false, t('dashboard.search.alert.invalidInput'))
        break
    }
  }

  return (
    <header className="relative w-full h-16 flex items-center px-4 sm:px-6 bg-gray-900 border-b border-gray-700">
      {/* Search Section */}
      <div className="flex-1 max-w-2xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative">
          <CrySearchBar
            placeholder={searchPlaceholder}
            width="w-full"
            height="h-11"
            textColor="text-gray-200"
            iconColor="text-gray-400"
            rounded="rounded-lg"
            ringColor="focus:ring-blue-500"
            className="text-sm bg-gray-800 border border-gray-600 placeholder-gray-400 focus:border-blue-500 transition-all duration-200"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </form>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-4 ml-6">
        <LanguageChangeButton />
        <div className="relative group">
          <UserIcon className="h-8 w-8 text-gray-400 hover:text-white cursor-pointer transition-colors duration-200" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
        </div>
      </div>
    </header>
  )
}
