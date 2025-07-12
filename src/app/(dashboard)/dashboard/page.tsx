import { DashboardHeader } from '@/components'
import { JSX } from 'react'

export default function DashboardPage(): JSX.Element {
  return (
    <div>
      <DashboardHeader />
      <h1 className="text-2xl font-semibold">Welcome to the Home Page</h1>
      <p className="mt-2 text-gray-700">This is your main content area.</p>
    </div>
  )
}
