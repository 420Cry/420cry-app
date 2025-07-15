'use client'

import { ReactElement } from 'react'
import { ArrowDownIcon, CryButton } from '@420cry/420cry-lib'
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
import { useTranslations } from 'next-intl'
import { ITransactionXPUB } from '@/types'

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
}: XPUBTransactionModalProps): ReactElement | null {
  const t = useTranslations('dashboard.xpubTransactionModal')

  if (!show || !transactionData) return null

  const sortedTxs = [...transactionData.txs].sort((a, b) => a.time - b.time)

  const chartData = {
    labels: sortedTxs.map((tx) => new Date(tx.time * 1000)),
    datasets: [
      {
        label: t('balanceGraph.label')   ,
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
    maintainAspectRatio: false, // allow height from container
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<'line'>) {
            return `${context.parsed.y}`
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'PPpp',
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: t('balanceGraph.label'),
        },
      },
    },
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="xpub-transaction-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <CryButton
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full transition"
          aria-label={t('closeButtonAriaLabel')}
        >
          <ArrowDownIcon className="w-6 h-6" />
        </CryButton>

        <h2
          id="xpub-transaction-modal-title"
          className="text-2xl font-extrabold text-gray-900 mb-6"
        >
          {t('title')} (XPUB)
        </h2>

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
      </div>
    </div>
  )
}
