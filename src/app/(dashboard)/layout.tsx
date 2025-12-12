'use client'

import { DashboardSidebar, DashboardHeader, BTCLoader } from '@/components'
import { JSX, ReactNode, useState } from 'react'
import {
  LoadingProvider,
  ModalProvider,
  ModalRenderer,
  useLoading,
  ThemeProvider,
  NotificationProvider,
  NotificationRenderer,
} from '@/lib'
import { themeClass, themeCombos } from '@/lib/theme/theme-classes'

function LayoutContent({ children }: { children: ReactNode }) {
  const { loading, setLoading } = useLoading()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div
      className={themeClass(
        'flex h-screen transition-colors duration-300 ease-in-out',
        themeCombos.bgSurface(),
      )}
      suppressHydrationWarning
    >
      <DashboardSidebar
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={toggleMobileMenu}
      />
      <div
        className={`flex-1 flex flex-col relative overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'md:ml-0' : 'md:ml-0'
        }`}
        suppressHydrationWarning
      >
        {/* Header */}
        <DashboardHeader
          setLoading={setLoading}
          onMobileMenuToggle={toggleMobileMenu}
        />

        {/* Main content */}
        <main
          className={themeClass(
            'flex-1 overflow-y-auto relative transition-colors duration-300 ease-in-out',
            themeCombos.bgSurface(),
          )}
          style={{
            padding: 'var(--theme-spacing-lg, 1.5rem)',
          }}
          suppressHydrationWarning
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

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <NotificationProvider>
          <ModalProvider>
            <LayoutContent>{children}</LayoutContent>
          </ModalProvider>
        </NotificationProvider>
      </LoadingProvider>
    </ThemeProvider>
  )
}
