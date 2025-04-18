import './globals.css'
import type { Metadata } from 'next'
import { JSX } from 'react'
import { getLocale, getMessages } from 'next-intl/server'
import { ClientLayout } from '../components'
import { ILocale } from '../types'

export const metadata: Metadata = {
  title: '420Crypto',
  description: '420Cry-app',
}

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}): Promise<JSX.Element> {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()])
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions()

  const localeData: ILocale = {
    locale,
    messages,
    timeZone,
  }

  return (
    <html lang={locale}>
      <body>
        <ClientLayout localeData={localeData}>{children}</ClientLayout>
      </body>
    </html>
  )
}
