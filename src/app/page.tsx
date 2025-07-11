import { DASHBOARD_ROUTE } from '@/lib'
import { redirect } from 'next/navigation'
import { ReactElement } from 'react'

export default function Home(): ReactElement {
  redirect(DASHBOARD_ROUTE)
}
