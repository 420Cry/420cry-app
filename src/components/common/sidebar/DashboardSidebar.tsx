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

  return (
    <aside
      className={`h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white border-r border-slate-700/50 backdrop-blur-xl flex flex-col justify-between transition-all duration-500 ease-in-out shadow-2xl ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div>
        {/* Logo + Toggle Button */}
        <div
          className={`flex items-center mb-8 ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {!collapsed && (
            <Image
              src={CryApplicationLogo}
              alt="Cry Application Logo"
              width={120}
              height={48}
              className="cursor-pointer transition-transform duration-300 hover:scale-105 filter drop-shadow-lg"
              priority
              onClick={() => router.push(DASHBOARD_ROUTE)}
            />
          )}
          <CryButton
            onClick={() => setCollapsed(!collapsed)}
            className="bg-slate-700/80 hover:bg-slate-600/80 text-white p-2 rounded-xl hover:rounded-lg transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm border border-slate-600/30"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-300" />
            ) : (
              <ArrowLeftIcon className="w-4 h-4 transition-transform duration-300" />
            )}
          </CryButton>
        </div>

        {/* Navigation */}
        <nav
          ref={navRef}
          className="flex flex-col gap-3 items-center w-full relative px-2"
        >
          {navItems.map(
            ({ labelKey, icon, ariaLabel, hasChildren, children, route }) => {
              const isOpen = openMenu === ariaLabel

              return (
                <div key={ariaLabel} className="relative group w-full">
                  <CryButton
                    className="hover:bg-slate-700/60 hover:shadow-lg hover:shadow-slate-900/20 p-3 rounded-xl flex justify-center items-center w-full transition-all duration-300 hover:scale-105 hover:border-slate-600/30 border border-transparent backdrop-blur-sm group-hover:bg-gradient-to-r group-hover:from-slate-700/40 group-hover:to-slate-600/40"
                    aria-label={ariaLabel}
                    onClick={() => {
                      if (hasChildren) {
                        if (collapsed) {
                          // If sidebar is collapsed and item has children, expand sidebar first
                          setCollapsed(false)
                          // Small delay to allow sidebar to expand before showing submenu
                          setTimeout(() => {
                            setOpenMenu(ariaLabel)
                          }, 300)
                        } else {
                          // If sidebar is expanded, toggle submenu normally
                          setOpenMenu(isOpen ? null : ariaLabel)
                        }
                      } else if (route) {
                        router.push(route)
                      }
                    }}
                  >
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      {icon}
                    </div>
                  </CryButton>

                  {/* Tooltip shown on hover (even when collapsed) */}
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-slate-900/95 backdrop-blur-md text-white text-sm rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 pointer-events-none shadow-xl border border-slate-700/50 font-medium">
                    {t(labelKey)}
                  </span>

                  {/* Sub-items */}
                  {hasChildren && isOpen && (
                    <>
                      {/* Sub-items when expanded */}
                      {!collapsed && (
                        <div className="pl-6 mt-2 space-y-2 animate-in slide-in-from-top-2 duration-300">
                          {children?.map((child) => (
                            <CryButton
                              key={child.ariaLabel}
                              className="flex items-center text-sm px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg w-full transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-slate-900/20 border border-transparent hover:border-slate-600/30 backdrop-blur-sm"
                              aria-label={child.ariaLabel}
                              onClick={() => {
                                setOpenMenu(null)
                                if (child.route) router.push(child.route)
                              }}
                            >
                              <span className="mr-3 text-slate-500 font-mono text-xs">
                                └
                              </span>
                              {t(child.labelKey)}
                            </CryButton>
                          ))}
                        </div>
                      )}

                      {/* Popup sub-items when collapsed - only show if not expanding */}
                      {collapsed && !isOpen && (
                        <div
                          className="absolute left-full top-0 ml-3 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl p-3 space-y-2 z-50 min-w-[180px] border border-slate-700/50 animate-in slide-in-from-left-2 duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {children?.map((child) => (
                            <CryButton
                              key={child.ariaLabel}
                              className="block w-full text-left text-sm px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-slate-900/20 border border-transparent hover:border-slate-600/30"
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
      <div className="relative group w-full flex justify-center px-2 pb-4">
        <CryButton
          className="hover:bg-red-600/20 hover:shadow-lg hover:shadow-red-900/20 p-3 rounded-xl flex justify-center items-center w-full transition-all duration-300 hover:scale-105 hover:border-red-500/30 border border-transparent backdrop-blur-sm group-hover:bg-gradient-to-r group-hover:from-red-600/20 group-hover:to-red-500/20"
          aria-label="logout"
          onClick={logout}
        >
          <div className="transition-transform duration-300 group-hover:scale-110">
            <SignOutIcon className="h-6 w-6 fill-current text-slate-300 group-hover:text-red-400" />
          </div>
        </CryButton>
        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-slate-900/95 backdrop-blur-md text-white text-sm rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 pointer-events-none shadow-xl border border-slate-700/50 font-medium">
          {t('dashboard.navigation.logout')}
        </span>
      </div>
    </aside>
  )
}
