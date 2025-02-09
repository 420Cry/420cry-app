import type { Metadata } from 'next'
import './globals.css'
import { AlertProvider } from '@/src/context/AlertContext'
import { JSX } from 'react'
import { getLocale, getMessages } from 'next-intl/server'
import { ClientLayout } from '../components'
import { ILocaleData } from '../types'

export const metadata: Metadata = {
  title: '420Crypto',
  description: '420Cry-app',
}

export default async function asyncRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): Promise<JSX.Element> {
  const locale = await getLocale()
  const messages = await getMessages()
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const localeData: ILocaleData = {
    locale,
    messages,
    timeZone,
  }
  return (
    <html lang={localeData.locale}>
      <body className="antialiased">
        <AlertProvider>
          <ClientLayout localeData={localeData}>{children}</ClientLayout>
        </AlertProvider>
      </body>
    </html>
  )
}
