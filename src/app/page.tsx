import { DASHBOARD_ROUTE } from '@/lib'
import { redirect } from 'next/navigation'
import { JSX } from 'react'

export default function Home(): JSX.Element {
  redirect(DASHBOARD_ROUTE)
}
