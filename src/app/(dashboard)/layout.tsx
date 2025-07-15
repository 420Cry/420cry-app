'use client'

import { DashboardSidebar, Loader } from '@/components'
import { JSX, ReactNode } from 'react'
import { LoadingProvider, useLoading } from '@/lib'

function LayoutContent({ children }: { children: ReactNode }) {
  const { loading } = useLoading()

  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-y-auto relative">
        {children}
        <Loader show={loading} />
      </main>
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
      <LayoutContent>{children}</LayoutContent>
    </LoadingProvider>
  )
}
