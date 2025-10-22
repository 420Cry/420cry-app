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

export default function Sidebar(): JSX.Element {
  const t = useTranslations()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
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
        className={`h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-r border-slate-700/30 backdrop-blur-xl flex flex-col justify-between transition-all duration-500 ease-in-out shadow-2xl relative overflow-hidden group ${
          collapsed ? 'w-16' : 'w-64'
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
    <aside
      className={`h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-r border-slate-700/30 backdrop-blur-xl flex flex-col justify-between transition-all duration-500 ease-in-out shadow-2xl relative overflow-hidden group ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      suppressHydrationWarning
    >
      {/* Animated background gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        suppressHydrationWarning
      />

      {/* Subtle animated border glow */}
      <div
        className="absolute inset-0 border-r border-gradient-to-b from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        suppressHydrationWarning
      />
      <div>
        {/* Logo + Toggle Button */}
        <div
          className={`flex items-center mb-8 mt-8 relative z-10 ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {!collapsed && (
            <div className="relative group">
              <Image
                src={CryApplicationLogo}
                alt="Cry Application Logo"
                width={120}
                height={48}
                className="cursor-pointer transition-all duration-300 hover:scale-105 filter drop-shadow-lg hover:drop-shadow-xl hover:brightness-110"
                priority
                onClick={() => router.push(DASHBOARD_ROUTE)}
              />
              {/* Subtle glow effect on logo hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          )}
          <CryButton
            onClick={() => setCollapsed(!collapsed)}
            className="bg-slate-700/90 hover:bg-slate-600/90 text-white p-2.5 rounded-xl hover:rounded-lg transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl backdrop-blur-sm border border-slate-600/40 hover:border-slate-500/60 relative overflow-hidden group"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            <div className="relative z-10">
              {collapsed ? (
                <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              ) : (
                <ArrowLeftIcon className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              )}
            </div>
          </CryButton>
        </div>

        {/* Navigation */}
        <nav
          ref={navRef}
          className="flex flex-col gap-2 items-center w-full relative px-2 z-10"
          suppressHydrationWarning
        >
          {navItems.map(
            ({ labelKey, icon, ariaLabel, hasChildren, children, route }) => {
              const isOpen = openMenu === ariaLabel

              return (
                <div key={ariaLabel} className="relative group w-full">
                  <CryButton
                    className="hover:bg-slate-700/70 hover:shadow-lg hover:shadow-slate-900/30 p-3 rounded-xl flex justify-center items-center w-full transition-all duration-300 hover:scale-105 hover:border-slate-600/40 border border-transparent backdrop-blur-sm group-hover:bg-gradient-to-r group-hover:from-slate-700/50 group-hover:to-slate-600/50 relative overflow-hidden"
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
                    {/* Subtle glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                      {icon}
                    </div>
                  </CryButton>

                  {/* Enhanced tooltip with better styling */}
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-slate-900/98 backdrop-blur-xl text-white text-sm rounded-xl py-2.5 px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 pointer-events-none shadow-2xl border border-slate-700/60 font-medium transform group-hover:scale-105">
                    {t(labelKey)}
                    {/* Tooltip arrow */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900/98 rotate-45 border-l border-b border-slate-700/60" />
                  </span>

                  {/* Sub-items */}
                  {hasChildren && isOpen && (
                    <>
                      {/* Sub-items when expanded */}
                      {!collapsed && (
                        <div className="pl-6 mt-2 space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                          {children?.map((child) => (
                            <CryButton
                              key={child.ariaLabel}
                              className="flex items-center text-sm px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-700/70 rounded-xl w-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-slate-900/30 border border-transparent hover:border-slate-600/40 backdrop-blur-sm relative overflow-hidden group"
                              aria-label={child.ariaLabel}
                              onClick={() => {
                                setOpenMenu(null)
                                if (child.route) router.push(child.route)
                              }}
                            >
                              {/* Subtle glow effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                              <span className="mr-3 text-slate-500 font-mono text-xs group-hover:text-blue-400 transition-colors duration-300">
                                └
                              </span>
                              <span className="relative z-10">
                                {t(child.labelKey)}
                              </span>
                            </CryButton>
                          ))}
                        </div>
                      )}

                      {/* Enhanced popup sub-items when collapsed */}
                      {collapsed && !isOpen && (
                        <div
                          className="absolute left-full top-0 ml-3 bg-slate-900/98 backdrop-blur-xl rounded-2xl shadow-2xl p-4 space-y-2 z-50 min-w-[200px] border border-slate-700/60 animate-in slide-in-from-left-2 duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {children?.map((child) => (
                            <CryButton
                              key={child.ariaLabel}
                              className="block w-full text-left text-sm px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/70 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-slate-900/30 border border-transparent hover:border-slate-600/40 relative overflow-hidden group"
                              aria-label={child.ariaLabel}
                              onClick={() => {
                                setOpenMenu(null)
                                if (child.route) router.push(child.route)
                              }}
                            >
                              {/* Subtle glow effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                              <span className="relative z-10">
                                {t(child.labelKey)}
                              </span>
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

      {/* Enhanced Logout Section */}
      <div className="relative group w-full flex justify-center px-2 pb-4 z-10">
        <CryButton
          className="hover:bg-red-600/30 hover:shadow-lg hover:shadow-red-900/30 p-3 rounded-xl flex justify-center items-center w-full transition-all duration-300 hover:scale-105 hover:border-red-500/40 border border-transparent backdrop-blur-sm group-hover:bg-gradient-to-r group-hover:from-red-600/30 group-hover:to-red-500/30 relative overflow-hidden"
          aria-label="logout"
          onClick={logout}
        >
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
            <SignOutIcon className="h-6 w-6 fill-current text-slate-300 group-hover:text-red-400 transition-colors duration-300" />
          </div>
        </CryButton>
        {/* Enhanced logout tooltip */}
        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-slate-900/98 backdrop-blur-xl text-white text-sm rounded-xl py-2.5 px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 pointer-events-none shadow-2xl border border-slate-700/60 font-medium transform group-hover:scale-105">
          {t('dashboard.navigation.logout')}
          {/* Tooltip arrow */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900/98 rotate-45 border-l border-b border-slate-700/60" />
        </span>
      </div>
    </aside>
  )
}
