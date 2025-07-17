'use client'

import { JSX, useState } from 'react'
import Image from 'next/image'

import {
  DASHBOARD_ROUTE,
  showToast,
  SIGN_IN_ROUTE,
  SignOutRequestService,
} from '@/lib'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
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

  const navItems = [
    {
      labelKey: 'dashboard.navigation.marketOverview',
      icon: <LineGraphIcon className="h-6 w-6" />,
      ariaLabel: 'market-overview',
    },
    {
      labelKey: 'dashboard.navigation.indicator',
      icon: <PieChartIcon className="h-6 w-6" />,
      ariaLabel: 'indicator',
    },
    {
      labelKey: 'dashboard.navigation.userPortfolio',
      icon: <UserIcon className="h-6 w-6" fill="currentColor" />,
      ariaLabel: 'user-portfolio',
    },
    {
      labelKey: 'dashboard.navigation.settings',
      icon: <SettingIcon className="h-6 w-6" fill="currentColor" />,
      ariaLabel: 'settings',
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
        <nav className="flex flex-col gap-4 items-center">
          {navItems.map(({ labelKey, icon, ariaLabel }) => (
            <div key={ariaLabel} className="relative group w-full">
              <CryButton
                className="hover:bg-gray-700 p-3 rounded flex justify-center items-center w-full"
                aria-label={ariaLabel}
              >
                {icon}
              </CryButton>
              {/* Tooltip shown on hover, regardless of collapsed */}
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {t(labelKey)}
              </span>
            </div>
          ))}
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
