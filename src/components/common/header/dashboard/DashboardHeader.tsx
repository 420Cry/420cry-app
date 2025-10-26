'use client'

import { JSX, useState, useEffect, useRef } from 'react'
import { CrySearchBar, UserIcon, CryButton, MenuIcon } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import { LanguageChangeButton, ThemeToggle } from '@/components'
import {
  resolveSearchInputType,
  showToast,
  externalService,
  useModal,
  SETTINGS_ROUTE,
  authService,
  SIGN_IN_ROUTE,
} from '@/lib'
import { SearchInput } from '@/types'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'

interface DashboardHeaderProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  onMobileMenuToggle?: () => void
}

export default function DashboardHeader({
  setLoading,
  onMobileMenuToggle,
}: DashboardHeaderProps): JSX.Element {
  const t = useTranslations()
  const router = useRouter()
  const searchPlaceholder = t('dashboard.search.searchPlayholder')
  const [searchTerm, setSearchTerm] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { openModal } = useModal()
  const { user, clearUser } = useAuthStore()
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
    <header className="relative w-full h-16 flex items-center px-2 sm:px-4 md:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out">
      {/* Mobile Menu Button */}
      <CryButton
        onClick={onMobileMenuToggle}
        className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 ease-in-out mr-2 flex-shrink-0"
        aria-label="Toggle mobile menu"
      >
        <MenuIcon className="w-5 h-5" />
      </CryButton>

      {/* Search Section */}
      <div className="flex-1 min-w-0 mx-2 md:mx-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <CrySearchBar
            placeholder={searchPlaceholder}
            width="w-full"
            height="h-10 md:h-11"
            textColor="text-gray-900 dark:text-gray-200"
            iconColor="text-gray-500 dark:text-gray-400"
            rounded="rounded-lg"
            ringColor="focus:ring-blue-500"
            className="text-sm md:text-base bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 transition-all duration-300 ease-in-out min-w-0"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </form>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-1 md:gap-4 flex-shrink-0">
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
        <div className="hidden sm:block">
          <LanguageChangeButton />
        </div>
        <div className="relative group" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="relative p-1.5 md:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-all duration-300 ease-in-out hover:scale-105"
          >
            <UserIcon className="h-6 w-6 md:h-8 md:w-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 ease-in-out" />
            <div className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full border-2 border-gray-200 dark:border-gray-900 shadow-lg"></div>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50">
              {/* User Profile Section */}
              <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {user?.fullname?.charAt(0)?.toUpperCase() ||
                        user?.username?.charAt(0)?.toUpperCase() ||
                        user?.email?.charAt(0)?.toUpperCase() ||
                        'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user?.fullname || 'User'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      @{user?.username || 'username'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>

                {/* User Data Display */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('dashboard.userMenu.userId')}:
                    </span>
                    <span className="text-gray-900 dark:text-gray-300 font-mono text-xs">
                      {user?.uuid
                        ? `${user.uuid.slice(0, 8)}...`
                        : t('dashboard.userMenu.notAvailable')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('dashboard.userMenu.twoFAStatus')}:
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user?.twoFAEnabled
                          ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                          : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {user?.twoFAEnabled
                        ? t('dashboard.userMenu.enabled')
                        : t('dashboard.userMenu.disabled')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('dashboard.userMenu.rememberMe')}:
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user?.rememberMe
                          ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                          : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {user?.rememberMe
                        ? t('app.common.yes')
                        : t('app.common.no')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-2 space-y-1">
                <CryButton
                  onClick={() => router.push(SETTINGS_ROUTE)}
                  className="w-full flex flex-row items-center justify-start gap-3 px-3 py-2.5 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-all duration-200 text-sm hover:scale-[1.02]"
                >
                  <span className="text-left">
                    {t('dashboard.userMenu.profileSettings')}
                  </span>
                </CryButton>
                <CryButton
                  onClick={async () => {
                    // Clear user state immediately for instant feedback
                    clearUser()
                    setShowUserMenu(false)

                    // Make API call in background
                    try {
                      const response = await authService.signOut.signOut()
                      if (response.isSuccess) {
                        router.push(SIGN_IN_ROUTE)
                      } else {
                        // If API call failed, show error but user is already signed out locally
                        showToast(false, t(response.message))
                        router.push(SIGN_IN_ROUTE)
                      }
                    } catch (_error) {
                      // If API call failed, show error but user is already signed out locally
                      showToast(false, t('app.alertTitle.somethingWentWrong'))
                      router.push(SIGN_IN_ROUTE)
                    }
                  }}
                  className="w-full flex flex-row items-center justify-start gap-3 px-3 py-2.5 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 text-sm hover:scale-[1.02]"
                >
                  <span className="text-left">
                    {t('dashboard.userMenu.signOut')}
                  </span>
                </CryButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
