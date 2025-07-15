'use client'

import React, { JSX } from 'react'
import { ITransactionXPUB } from '@/types'
import { useTranslations } from 'next-intl'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
  TooltipItem,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { CryModal } from '@420cry/420cry-lib'

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
)

interface XPUBTransactionModalProps {
  show: boolean
  onClose: () => void
  transactionData: ITransactionXPUB | null
}

export default function XPUBTransactionModal({
  show,
  onClose,
  transactionData,
}: XPUBTransactionModalProps): JSX.Element | null {
  const t = useTranslations('dashboard.xpubTransactionModal')

  if (!transactionData) return null

  const sortedTxs = [...transactionData.txs].sort((a, b) => a.time - b.time)

  const chartData = {
    labels: sortedTxs.map((tx) => new Date(tx.time * 1000)),
    datasets: [
      {
        label: t('balanceGraph.label'),
        data: sortedTxs.map((tx) => tx.balance),
        fill: false,
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        tension: 0.2,
      },
    ],
  }

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => `${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'day', tooltipFormat: 'PPpp' },
        title: { display: true, text: 'Date' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: t('balanceGraph.label') },
      },
    },
  }

  return (
    <CryModal
      show={show}
      onClose={onClose}
      title={`${t('title')} (XPUB)`}
      ariaLabelledBy="xpub-transaction-modal-title"
      maxWidth="max-w-3xl"
    >
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t('balanceGraph.title', { defaultValue: 'Balance Over Time' })}
        </h3>
        <div className="flex justify-center w-full max-w-4xl mx-auto">
          <div className="w-full h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {t('title')}
        </h3>
        <ul className="space-y-3 text-sm text-gray-700">
          {sortedTxs.map((tx, idx) => (
            <li
              key={idx}
              className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition"
            >
              <p>
                <strong>{t('txid')}:</strong>{' '}
                <code className="break-all">{tx.txid}</code>
              </p>
              <p>
                <strong>{t('date')}:</strong>{' '}
                {new Date(tx.time * 1000).toLocaleString()}
              </p>
              <p>
                <strong>{t('balance')}:</strong> {tx.balance}
              </p>
              <p>
                <strong>{t('balanceDiff')}:</strong> {tx.balance_diff}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </CryModal>
  )
}
