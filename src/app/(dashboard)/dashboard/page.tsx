'use client'

import { JSX } from 'react'

export default function DashboardPage(): JSX.Element {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Welcome to the Home Page
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        This is your main content area.
      </p>
    </div>
  )
}
