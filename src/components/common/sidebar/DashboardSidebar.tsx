'use client'

import { JSX, useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import {
  DASHBOARD_ROUTE,
  FEAR_AND_GREED_ROUTE,
  SETTINGS_ROUTE,
  showToast,
  SIGN_IN_ROUTE,
  authService,
  useClientOnly,
} from '@/lib'

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CryButton,
  LineGraphIcon,
  PieChartIcon,
  SettingIcon,
  SignOutIcon,
  UserIcon,
} from '@420cry/420cry-lib'

import { CryApplicationLogo } from '@/assets'

interface DashboardSidebarProps {
  mobileMenuOpen?: boolean
  onMobileMenuToggle?: () => void
}

export default function Sidebar({
  mobileMenuOpen = false,
  onMobileMenuToggle: _onMobileMenuToggle,
}: DashboardSidebarProps): JSX.Element {
  const t = useTranslations()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  // Sync mobile menu state with collapsed state
  useEffect(() => {
    if (window.innerWidth < 768) {
      setCollapsed(!mobileMenuOpen)
    }
  }, [mobileMenuOpen])
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const isClient = useClientOnly()
  const navRef = useRef<HTMLDivElement>(null)

  const logout = async () => {
    try {
      const response = await authService.signOut.signOut()
      if (response.isSuccess) {
        router.push(SIGN_IN_ROUTE)
      }
    } catch {
      showToast(false, t('app.alertTitle.somethingWentWrong'))
    }
  }

  // Close popup on clicking outside sidebar nav
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openMenu !== null &&
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openMenu])

  const navItems = [
    {
      labelKey: 'dashboard.navigation.marketOverview',
      icon: <LineGraphIcon className="h-6 w-6" />,
      ariaLabel: 'market-overview',
      route: DASHBOARD_ROUTE, // Placeholder route
    },
    {
      labelKey: 'dashboard.navigation.indicator.label',
      icon: <PieChartIcon className="h-6 w-6" />,
      ariaLabel: 'indicator',
      hasChildren: true,
      children: [
        {
          labelKey: 'dashboard.navigation.indicator.fearAndGreed',
          ariaLabel: 'fear-and-greed',
          route: FEAR_AND_GREED_ROUTE,
        },
      ],
    },
    {
      labelKey: 'dashboard.navigation.userPortfolio',
      icon: <UserIcon className="h-6 w-6" fill="currentColor" />,
      ariaLabel: 'user-portfolio',
      route: DASHBOARD_ROUTE, // Placeholder route
    },
    {
      labelKey: 'dashboard.navigation.settings',
      icon: <SettingIcon className="h-6 w-6" fill="currentColor" />,
      ariaLabel: 'settings',
      route: SETTINGS_ROUTE,
    },
  ]

  // Prevent hydration mismatch by rendering only on client side
  if (!isClient) {
    return (
      <aside
        className={`h-screen bg-gray-900/95 backdrop-blur-xl text-white border-r border-gray-800/50 flex flex-col transition-all duration-300 ease-in-out shadow-2xl ${
          collapsed ? 'w-16' : 'w-72'
        }`}
        suppressHydrationWarning
      >
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse">Loading...</div>
        </div>
      </aside>
    )
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={`h-screen bg-gray-900 text-white border-r border-gray-800/50 flex flex-col transition-all duration-300 ease-in-out shadow-2xl ${
          collapsed ? 'w-16' : 'w-72'
        } md:relative fixed inset-y-0 left-0 z-50 md:z-auto ${
          collapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
        }`}
        suppressHydrationWarning
      >
        <div>
          {/* Header */}
          <div
            className={`flex items-center border-b border-gray-800/30 ${collapsed ? 'justify-center p-4' : 'justify-between p-6'}`}
          >
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <Image
                  src={CryApplicationLogo}
                  alt="Cry Application Logo"
                  width={120}
                  height={48}
                  className="cursor-pointer"
                  style={{ width: 'auto', height: 'auto' }}
                  onClick={() => router.push(DASHBOARD_ROUTE)}
                />
              </div>
            )}
            <CryButton
              onClick={() => setCollapsed(!collapsed)}
              className="p-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200 hover:scale-105"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ArrowRightIcon className="w-4 h-4" />
              ) : (
                <ArrowLeftIcon className="w-4 h-4" />
              )}
            </CryButton>
          </div>

          {/* Navigation */}
          <nav
            className={`flex-1 p-4 space-y-1 ${collapsed ? 'flex flex-col items-center' : ''} overflow-y-auto`}
            ref={navRef}
            suppressHydrationWarning
          >
            {navItems.map(
              ({ labelKey, icon, ariaLabel, hasChildren, children, route }) => {
                const isOpen = openMenu === ariaLabel

                return (
                  <div key={ariaLabel} className="relative group">
                    <button
                      className={`flex items-center gap-4 px-4 py-3 text-gray-300 rounded-xl hover:bg-gray-800/50 hover:text-white transition-all duration-200 group-hover:shadow-lg group-hover:shadow-gray-900/20 ${
                        collapsed ? 'w-12 justify-center' : 'w-full'
                      } touch-manipulation`}
                      onClick={() => {
                        if (hasChildren) {
                          if (collapsed) {
                            setCollapsed(false)
                            setTimeout(() => {
                              setOpenMenu(ariaLabel)
                            }, 300)
                          } else {
                            setOpenMenu(isOpen ? null : ariaLabel)
                          }
                        } else if (route) {
                          router.push(route)
                          // Close sidebar on mobile after navigation
                          if (window.innerWidth < 768) {
                            setCollapsed(true)
                          }
                        }
                      }}
                    >
                      <div className="flex items-center justify-center w-5 h-5 text-gray-400 group-hover:text-white transition-colors">
                        {icon}
                      </div>
                      {!collapsed && (
                        <span className="text-sm font-medium">
                          {t(labelKey)}
                        </span>
                      )}
                      {hasChildren && !collapsed && (
                        <div className="ml-auto">
                          <div
                            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                          >
                            <svg viewBox="0 0 16 16" fill="currentColor">
                              <path
                                d="M6 4l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>

                    {/* Tooltip for collapsed state */}
                    {collapsed && (
                      <div className="absolute left-full top-0 ml-3 bg-gray-800/95 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-xl">
                        {t(labelKey)}
                      </div>
                    )}

                    {/* Sub-items */}
                    {hasChildren && isOpen && !collapsed && (
                      <div className="ml-8 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                        {children?.map((child) => (
                          <button
                            key={child.ariaLabel}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 rounded-lg hover:bg-gray-800/30 hover:text-white transition-all duration-200 hover:translate-x-1 touch-manipulation"
                            onClick={() => {
                              setOpenMenu(null)
                              if (child.route) {
                                router.push(child.route)
                                // Close sidebar on mobile after navigation
                                if (window.innerWidth < 768) {
                                  setCollapsed(true)
                                }
                              }
                            }}
                          >
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                            <span className="font-medium">
                              {t(child.labelKey)}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              },
            )}
          </nav>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t border-gray-800/30 ${collapsed ? 'flex flex-col items-center' : ''}`}
        >
          <div className="mb-4">
            <button
              className={`flex items-center gap-4 px-4 py-3 text-gray-300 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 group border border-red-500/20 hover:border-red-500/40 touch-manipulation ${
                collapsed ? 'w-12 justify-center' : 'w-full'
              }`}
              onClick={() => {
                logout()
                // Close sidebar on mobile after logout
                if (window.innerWidth < 768) {
                  setCollapsed(true)
                }
              }}
            >
              <div className="flex items-center justify-center w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors">
                <SignOutIcon className="h-5 w-5" />
              </div>
              {!collapsed && (
                <span className="text-sm font-medium">
                  {t('dashboard.navigation.logout')}
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
