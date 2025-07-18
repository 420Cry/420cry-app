'use client'

import {
  DashboardHeader,
  TransactionModal,
  XPUBTransactionModal,
} from '@/components'
import { useLoading } from '@/lib'
import { ITransactionData, ITransactionXPUB } from '@/types'
import { JSX, useState } from 'react'

export default function DashboardPage(): JSX.Element {
  const [transactionData, setTransactionData] =
    useState<ITransactionData | null>(null)
  const [xpubTransactionData, setXpubTransactionData] =
    useState<ITransactionXPUB | null>(null)

  const { setLoading } = useLoading()

  return (
    <div className="relative min-h-screen">
      <DashboardHeader
        setTransactionData={setTransactionData}
        setXpubTransactionData={setXpubTransactionData}
        setLoading={setLoading}
      />

      <main className="p-6">
        <h1 className="text-2xl font-semibold">Welcome to the Home Page</h1>
        <p className="mt-2 text-gray-700">This is your main content area.</p>
      </main>

      {/* Modals */}
      <TransactionModal
        show={Boolean(transactionData)}
        transaction={transactionData}
        onClose={() => setTransactionData(null)}
      />
      <XPUBTransactionModal
        show={Boolean(xpubTransactionData)}
        transactionData={xpubTransactionData}
        onClose={() => setXpubTransactionData(null)}
      />
    </div>
  )
}
