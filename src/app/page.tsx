'use client'

import { Sidebar } from '@/components'
import { ReactElement } from 'react'

export default function Home(): ReactElement {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold">Welcome to the Home Page</h1>
        <p className="mt-2 text-gray-700">This is your main content area.</p>
      </main>
    </div>
  )
}
