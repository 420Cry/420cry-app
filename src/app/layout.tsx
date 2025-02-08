import type { Metadata } from 'next'
import './globals.css'
import { AlertProvider } from '@/src/context/AlertContext'
import { JSX } from 'react'
import { getLocale, getMessages } from 'next-intl/server'
import { ClientWrapper } from '../components'
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

  // Get the timezone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  // Combine the values into a single object with the ILocaleData type
  const localeData: ILocaleData = {
    locale,
    messages,
    timeZone,
  }

  localeData.locale = 'vn'
  // Log the combined object for debugging purposes
  console.log('Locale Data:', localeData)

  return (
    <html lang={locale}>
      <body className="antialiased">
        <AlertProvider>
          <ClientWrapper localeData={localeData}>{children}</ClientWrapper>
        </AlertProvider>
      </body>
    </html>
  )
}
