'use client'

import { DashboardSidebar, DashboardHeader, Loader } from '@/components'
import { JSX, ReactNode, useState } from 'react'
import {
  LoadingProvider,
  ModalProvider,
  ModalRenderer,
  useLoading,
} from '@/lib'

function LayoutContent({ children }: { children: ReactNode }) {
  const { loading, setLoading } = useLoading()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="flex h-screen bg-gray-900" suppressHydrationWarning>
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
          className="flex-1 p-6 overflow-y-auto relative bg-gray-900"
          suppressHydrationWarning
        >
          {children}
          <Loader show={loading} />
        </main>

        {/* Render dynamic modals */}
        <ModalRenderer />
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
    <LoadingProvider>
      <ModalProvider>
        <LayoutContent>{children}</LayoutContent>
      </ModalProvider>
    </LoadingProvider>
  )
}
