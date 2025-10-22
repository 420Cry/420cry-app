'use client'

import { DashboardSidebar, DashboardHeader, Loader } from '@/components'
import { JSX, ReactNode } from 'react'
import {
  LoadingProvider,
  ModalProvider,
  ModalRenderer,
  useLoading,
} from '@/lib'

function LayoutContent({ children }: { children: ReactNode }) {
  const { loading, setLoading } = useLoading()

  return (
    <div className="flex h-screen bg-gray-900">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <DashboardHeader setLoading={setLoading} />

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto relative bg-gray-900">
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
