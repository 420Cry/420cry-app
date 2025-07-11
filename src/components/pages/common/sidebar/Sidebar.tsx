'use client'

import Link from 'next/link'
import { ReactElement } from 'react'
import Image from 'next/image'
import cryApplicationLogo from '@/../public/logo/CryApplicationLogo.png'
import { showToast, SIGN_IN_ROUTE, SignOutRequestService } from '@/lib'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function Sidebar(): ReactElement {
  const t = useTranslations()
  const router = useRouter()
  const logout = async () => {
    try {
      const resposne = await SignOutRequestService.signOut()
      if (resposne.isSuccess) {
        router.push(SIGN_IN_ROUTE)
      }
    } catch {
      showToast(false, t('app.alertTitle.somethingWentWrong'))
    }
  }
  return (
    <aside className="w-40 bg-gray-800 text-white p-4 h-screen">
      <Image
        src={cryApplicationLogo}
        alt="dark mode logo"
        width={143}
        height={58}
        className="cursor-pointer"
        priority
      />
      <nav className="flex flex-col space-y-2">
        <Link href="/" className="hover:bg-gray-700 p-2 rounded">
          Line Graph (Overview market)
        </Link>
        <Link href="/about" className="hover:bg-gray-700 p-2 rounded">
          Pie chart (Market share)
        </Link>
        <Link href="/user" className="hover:bg-gray-700 p-2 rounded">
          UserIcon (User porfolio and transaction history)
        </Link>
        <Link href="/user" className="hover:bg-gray-700 p-2 rounded">
          Setting (User settings)
        </Link>
        <p onClick={logout} className="hover:bg-gray-700 p-2 rounded">
          Logout (Sign out)
        </p>
      </nav>
    </aside>
  )
}
