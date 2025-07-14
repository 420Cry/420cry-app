'use client'

import { JSX, useState } from 'react'

import { ITransactionData } from '@/types'
import { DashboardHeader, LoadingModal, TransactionModal } from '@/components'

export default function DashboardPage(): JSX.Element {
  const [transactionData, setTransactionData] =
    useState<ITransactionData | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="relative min-h-screen">
      <DashboardHeader
        setTransactionData={setTransactionData}
        setLoading={setLoading}
      />

      <main className="p-6">
        <h1 className="text-2xl font-semibold">Welcome to the Home Page</h1>
        <p className="mt-2 text-gray-700">This is your main content area.</p>
      </main>

      {/* Modals */}
      <LoadingModal show={loading} />
      <TransactionModal
        show={Boolean(transactionData)}
        transaction={transactionData}
        onClose={() => setTransactionData(null)}
      />
    </div>
  )
}
