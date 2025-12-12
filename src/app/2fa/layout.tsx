'use client'

import { TwoFactorHeader, BTCLoader } from '@/components'
import { JSX, ReactNode } from 'react'
import {
  LoadingProvider,
  ModalProvider,
  ModalRenderer,
  useLoading,
  NotificationProvider,
  NotificationRenderer,
} from '@/lib'

function LayoutContent({ children }: { children: ReactNode }) {
  const { loading } = useLoading()

  return (
    <div className="flex h-screen bg-linear-to-r from-success-400 to-success-600">
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <TwoFactorHeader />

        {/* Main content */}
        <main
          className="flex-1 flex items-center justify-center"
          style={{
            padding: 'var(--theme-spacing-lg, 1.5rem)',
          }}
        >
          {children}
          <BTCLoader show={loading} />
        </main>

        {/* Render dynamic modals */}
        <ModalRenderer />
        <NotificationRenderer />
      </div>
    </div>
  )
}

export default function TwoFactorLayout({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <LoadingProvider>
      <NotificationProvider>
        <ModalProvider>
          <LayoutContent>{children}</LayoutContent>
        </ModalProvider>
      </NotificationProvider>
    </LoadingProvider>
  )
}
