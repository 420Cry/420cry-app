'use client'

import { JSX } from 'react'
import { themeClass, themeCombos } from '@/lib/theme/theme-classes'

export default function DashboardPage(): JSX.Element {
  return (
    <div>
      <h1
        className={themeClass(
          'text-2xl font-semibold',
          themeCombos.textPrimary(),
        )}
      >
        Welcome to the Home Page
      </h1>
      <p className={themeClass('mt-2', themeCombos.textSecondary())}>
        This is your main content area.
      </p>
    </div>
  )
}
