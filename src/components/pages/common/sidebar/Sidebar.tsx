'use client'

import { ReactElement, useState } from 'react'
import Image from 'next/image'
import cryApplicationLogo from '@/../public/logo/CryApplicationLogo.png'
import { showToast, SIGN_IN_ROUTE, SignOutRequestService } from '@/lib'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  CryButton,
  LineGraphIcon,
  PieChartIcon,
  SettingIcon,
  SignOutIcon,
  UserIcon,
} from '@420cry/420cry-lib'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function Sidebar(): ReactElement {
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

  return (
    <aside
      className={`h-screen bg-gray-800 text-white p-4 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-40'
      }`}
    >
      <div>
        {/* Toggle Button */}
        <div
          className={`mb-4 flex ${collapsed ? 'justify-end' : 'justify-center'}`}
        >
          <CryButton
            onClick={() => setCollapsed(!collapsed)}
            className="bg-gray-700 text-white p-1 rounded hover:bg-gray-600"
          >
            {collapsed ? (
              <ChevronRightIcon className="w-5 h-5" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5" />
            )}
          </CryButton>
        </div>

        {/* Logo */}
        {!collapsed && (
          <div className="mb-6">
            <Image
              src={cryApplicationLogo}
              alt="Cry Application Logo"
              width={120}
              height={40}
              className="cursor-pointer"
              priority
            />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-4">
          <CryButton
            className="hover:bg-gray-700 p-3 rounded flex justify-center items-center"
            aria-label="market-overview"
          >
            <LineGraphIcon className="h-6 w-6" />
          </CryButton>

          <CryButton
            className="hover:bg-gray-700 p-3 rounded flex justify-center items-center"
            aria-label="market-share"
          >
            <PieChartIcon className="h-6 w-6" />
          </CryButton>

          <CryButton
            className="hover:bg-gray-700 p-3 rounded flex justify-center items-center"
            aria-label="user-portfolio"
          >
            <UserIcon className="h-6 w-6" fill="currentColor" />
          </CryButton>

          <CryButton
            className="hover:bg-gray-700 p-3 rounded flex justify-center items-center"
            aria-label="settings"
          >
            <SettingIcon className="h-6 w-6" fill="currentColor" />
          </CryButton>
        </nav>
      </div>

      {/* Logout */}
      <CryButton
        className="hover:bg-gray-700 p-3 rounded flex justify-center items-center"
        aria-label="logout"
        onClick={logout}
      >
        <SignOutIcon className="h-6 w-6" fill="currentColor" />
      </CryButton>
    </aside>
  )
}
