'use client'

import { TwoFactorHeader } from '@/components'
import { JSX, ReactNode } from 'react'

function LayoutContent({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gradient-to-r from-green-400 to-emerald-600">
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <TwoFactorHeader />

        {/* Main content */}
        <main className="flex-1 p-6 flex items-center justify-center">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function TwoFactorLayout({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return <LayoutContent>{children}</LayoutContent>
}
