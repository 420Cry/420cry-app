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
import { CryModal, ChartLineIcon, CopyIcon } from '@420cry/420cry-lib'

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
        fill: {
          target: 'origin',
          above: 'rgba(59, 130, 246, 0.1)',
        },
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        tension: 0.4,
      },
    ],
  }

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 40,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
      axis: 'x',
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          title: (context) => {
            const dataIndex = context[0].dataIndex
            const tx = sortedTxs[dataIndex]
            return new Date(tx.time * 1000).toLocaleDateString()
          },
          label: (context: TooltipItem<'line'>) => {
            const dataIndex = context.dataIndex
            const tx = sortedTxs[dataIndex]
            return [`Balance: ${tx.balance}`, `Change: ${tx.balance_diff}`]
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'day', tooltipFormat: 'PPpp' },
        display: true,
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#9ca3af',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
            weight: 'normal',
          },
        },
        grid: {
          color: 'rgba(55, 65, 81, 0.3)',
        },
        border: {
          color: 'rgba(55, 65, 81, 0.5)',
        },
      },
      y: {
        beginAtZero: true,
        display: true,
        title: {
          display: true,
          text: t('balanceGraph.label'),
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#9ca3af',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
            weight: 'normal',
          },
        },
        grid: {
          color: 'rgba(55, 65, 81, 0.3)',
        },
        border: {
          color: 'rgba(55, 65, 81, 0.5)',
        },
      },
    },
  }

  return (
    <CryModal
      show={show}
      onClose={onClose}
      title={`${t('title')} (XPUB)`}
      ariaLabelledBy="xpub-transaction-modal-title"
      maxWidth="3xl"
    >
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <ChartLineIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {t('balanceGraph.title', { defaultValue: 'Balance Over Time' })}
          </h3>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <div className="w-full h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <CopyIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{t('title')}</h3>
        </div>
        <div className="space-y-4">
          {sortedTxs.map((tx, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    {idx + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t('txid')}:
                      </span>
                      <code className="block mt-1 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-md break-all text-gray-800 dark:text-gray-200">
                        {tx.txid}
                      </code>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t('date')}:
                      </span>
                      <span className="block mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(tx.time * 1000).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t('balance')}:
                      </span>
                      <span className="ml-2 text-sm font-mono bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-md">
                        {tx.balance}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t('balanceDiff')}:
                      </span>
                      <span
                        className={`ml-2 text-sm font-mono px-2 py-1 rounded-md ${
                          parseFloat(String(tx.balance_diff)) >= 0
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}
                      >
                        {tx.balance_diff}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </CryModal>
  )
}
