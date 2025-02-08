'use client'
import { useAlert } from '@/src/context/AlertContext'
import { ILocaleData } from '@/src/types'
import { CryAlert } from '@420cry/420cry-lib'
import { IntlProvider } from 'next-intl'
import { JSX, ReactNode } from 'react'

interface ClientLayoutProps {
  children: ReactNode
  localeData: ILocaleData
}

const ClientLayout = ({
  children,
  localeData,
}: ClientLayoutProps): JSX.Element => {
  const { alert } = useAlert()

  return (
    <IntlProvider
      messages={localeData.messages}
      locale={localeData.locale}
      timeZone={localeData.timeZone}
    >
      {alert.show && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-80 p-4 z-50">
          <CryAlert type={alert.type} containerClass="w-80" title="">
            {alert.message}
          </CryAlert>
        </div>
      )}
      {children}
    </IntlProvider>
  )
}

export default ClientLayout
