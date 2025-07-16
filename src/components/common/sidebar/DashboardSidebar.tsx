'use client'

import { JSX, useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import {
  DASHBOARD_ROUTE,
  FEAR_AND_GREED_ROUTE,
  showToast,
  SIGN_IN_ROUTE,
  SignOutRequestService,
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

export default function Sidebar(): JSX.Element {
  const t = useTranslations()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  const logout = async () => {
    try {
      const response = await SignOutRequestService.signOut()
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
      route: DASHBOARD_ROUTE, // Placeholder route
    },
  ]

  return (
    <aside
      className={`h-screen bg-gray-800 text-white p-4 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-44'
      }`}
    >
      <div>
        {/* Logo + Toggle Button */}
        <div
          className={`flex items-center mb-6 ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {!collapsed && (
            <Image
              src={CryApplicationLogo}
              alt="Cry Application Logo"
              width={100}
              height={40}
              className="cursor-pointer"
              priority
              onClick={() => router.push(DASHBOARD_ROUTE)}
            />
          )}
          <CryButton
            onClick={() => setCollapsed(!collapsed)}
            className="bg-gray-700 text-white p-1 rounded hover:bg-gray-600"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ArrowRightIcon className="w-5 h-5" />
            ) : (
              <ArrowLeftIcon className="w-5 h-5" />
            )}
          </CryButton>
        </div>

        {/* Navigation */}
        <nav
          ref={navRef}
          className="flex flex-col gap-2 items-center w-full relative"
        >
          {navItems.map(
            ({ labelKey, icon, ariaLabel, hasChildren, children, route }) => {
              const isOpen = openMenu === ariaLabel

              return (
                <div key={ariaLabel} className="relative group w-full">
                  <CryButton
                    className="hover:bg-gray-700 p-3 rounded flex justify-center items-center w-full"
                    aria-label={ariaLabel}
                    onClick={() => {
                      if (hasChildren) {
                        setOpenMenu(isOpen ? null : ariaLabel)
                      } else if (route) {
                        router.push(route)
                      }
                    }}
                  >
                    {icon}
                  </CryButton>

                  {/* Tooltip shown on hover (even when collapsed) */}
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    {t(labelKey)}
                  </span>

                  {/* Sub-items */}
                  {hasChildren && isOpen && (
                    <>
                      {/* Sub-items when expanded */}
                      {!collapsed && (
                        <div className="pl-4 mt-1 space-y-1">
                          {children?.map((child) => (
                            <CryButton
                              key={child.ariaLabel}
                              className="flex items-center text-xs px-2 py-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded w-full transition-colors"
                              aria-label={child.ariaLabel}
                              onClick={() => {
                                setOpenMenu(null)
                                if (child.route) router.push(child.route)
                              }}
                            >
                              <span className="mr-2 text-gray-500">|_</span>
                              {t(child.labelKey)}
                            </CryButton>
                          ))}
                        </div>
                      )}

                      {/* Popup sub-items when collapsed */}
                      {collapsed && (
                        <div
                          className="absolute left-full top-0 ml-2 bg-gray-900 rounded shadow-lg p-2 space-y-1 z-50 min-w-[150px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {children?.map((child) => (
                            <CryButton
                              key={child.ariaLabel}
                              className="block w-full text-left text-xs px-3 py-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                              aria-label={child.ariaLabel}
                              onClick={() => {
                                setOpenMenu(null)
                                if (child.route) router.push(child.route)
                              }}
                            >
                              {t(child.labelKey)}
                            </CryButton>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            },
          )}
        </nav>
      </div>

      {/* Logout */}
      <div className="relative group w-full flex justify-center">
        <CryButton
          className="hover:bg-gray-700 p-3 rounded flex justify-center items-center w-full"
          aria-label="logout"
          onClick={logout}
        >
          <SignOutIcon className="h-6 w-6" fill="currentColor" />
        </CryButton>
        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
          {t('dashboard.navigation.logout')}
        </span>
      </div>
    </aside>
  )
}
