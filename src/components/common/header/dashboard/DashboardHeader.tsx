'use client'

import { JSX, useState, useEffect, useRef } from 'react'
import { CrySearchBar, UserIcon } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import { LanguageChangeButton } from '@/components'
import {
  resolveSearchInputType,
  showToast,
  externalService,
  useModal,
} from '@/lib'
import { SearchInput } from '@/types'
import { useAuthStore } from '@/store/useAuthStore'

interface DashboardHeaderProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  onMobileMenuToggle?: () => void
}

export default function DashboardHeader({
  setLoading,
  onMobileMenuToggle,
}: DashboardHeaderProps): JSX.Element {
  const t = useTranslations()
  const searchPlaceholder = t('dashboard.search.searchPlayholder')
  const [searchTerm, setSearchTerm] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { openModal } = useModal()
  const { user } = useAuthStore()
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
      {/* Mobile Menu Button */}
      <button
        onClick={onMobileMenuToggle}
        className="md:hidden p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors mr-4"
        aria-label="Toggle mobile menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

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
        <div className="relative group" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="relative p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
          >
            <UserIcon className="h-8 w-8 text-gray-400 hover:text-white transition-colors duration-200" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 z-50">
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.fullname?.charAt(0) ||
                        user?.username?.charAt(0) ||
                        user?.email?.charAt(0) ||
                        'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user?.fullname || user?.username || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:text-white transition-colors text-sm">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 14a4 4 0 0 0-8 0v1h8v-1Z" />
                    </svg>
                  </div>
                  Profile Settings
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:text-white transition-colors text-sm">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM3 8a5 5 0 0 1 5-5v10a5 5 0 0 1-5-5Z" />
                    </svg>
                  </div>
                  Preferences
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M6 12.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1H7.707l2.147-2.146a.5.5 0 0 0-.708-.708L7 11.293V9.5a.5.5 0 0 0-1 0v3Z" />
                      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM3 8a5 5 0 0 1 5-5v10a5 5 0 0 1-5-5Z" />
                    </svg>
                  </div>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
