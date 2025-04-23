'use client'
import { ILocale } from '@/src/types'
import { IntlProvider } from 'next-intl'
import { JSX, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

interface ClientLayoutProps {
  children: ReactNode
  localeData: ILocale
}

const ClientLayout = ({
  children,
  localeData,
}: ClientLayoutProps): JSX.Element => {
  return (
    <IntlProvider
      messages={localeData.messages}
      locale={localeData.locale}
      timeZone={localeData.timeZone}
    >
      <Toaster
        toastOptions={{
          className: 'w-full',
        }}
      />
      {children}
    </IntlProvider>
  )
}

export default ClientLayout
