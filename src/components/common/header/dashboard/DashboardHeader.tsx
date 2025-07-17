'use client'

import { JSX, useState } from 'react'
import { CrySearchBar, UserIcon } from '@420cry/420cry-lib'
import LanguageChangeButton from '../LanguageChangeButton'
import { useTranslations } from 'next-intl'
import { ITransactionData, ITransactionXPUB, SearchInput } from '@/types'
import { resolveSearchInputType, showToast, TransactionService } from '@/lib'

interface DashboardHeaderProps {
  setTransactionData: React.Dispatch<
    React.SetStateAction<ITransactionData | null>
  >
  setXpubTransactionData: React.Dispatch<
    React.SetStateAction<ITransactionXPUB | null>
  >
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DashboardHeader({
  setTransactionData,
  setXpubTransactionData,
  setLoading,
}: DashboardHeaderProps): JSX.Element {
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
      case 'TXID': {
        const { txid } = input
        setLoading(true)

        try {
          const transaction = await TransactionService.getTransaction(txid)

          if (transaction.isSuccess && transaction.data) {
            setTransactionData(transaction.data)
          } else {
            setTransactionData(null)
          }

          showToast(transaction.isSuccess, t(transaction.message))
        } catch (error) {
          showToast(
            false,
            error instanceof Error ? error.message : String(error),
          )
          setTransactionData(null)
        } finally {
          setLoading(false)
        }
        break
      }
      case 'XPUB': {
        const { xpub } = input
        setLoading(true)
        try {
          const transaction =
            await TransactionService.getTransactionByXPUB(xpub)

          if (transaction.isSuccess && transaction.data) {
            setXpubTransactionData(transaction.data)
          } else {
            setXpubTransactionData(null)
          }

          showToast(transaction.isSuccess, t(transaction.message))
        } catch (error) {
          showToast(
            false,
            error instanceof Error ? error.message : String(error),
          )
          setXpubTransactionData(null)
        } finally {
          setLoading(false)
        }
        break
      }

      default:
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
