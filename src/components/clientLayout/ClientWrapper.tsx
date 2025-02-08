'use client'

import ClientLayout from './ClientLayout'
import { JSX, useState, useEffect } from 'react'
import { CrySpinner } from '@420cry/420cry-lib'
import { ILocaleData } from '@/src/types'

interface ClientWrapperProps {
  children: React.ReactNode
  localeData: ILocaleData
}

const ClientWrapper = ({
  children,
  localeData,
}: ClientWrapperProps): JSX.Element => {
  const [timeZone, setTimeZone] = useState<string | null>(null)

  useEffect(() => {
    const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setTimeZone(clientTimeZone)
  }, [])

  if (!timeZone) {
    return <CrySpinner message="Establishing connection..." />
  }

  return <ClientLayout localeData={localeData}>{children}</ClientLayout>
}

export default ClientWrapper
