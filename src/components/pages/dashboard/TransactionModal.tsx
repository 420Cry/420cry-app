'use client'

import React, { JSX } from 'react'
import { ITransactionData } from '@/types'
import { useTranslations } from 'next-intl'
import { CryModal } from '@420cry/420cry-lib'

interface TransactionModalProps {
  show: boolean
  onClose: () => void
  transaction: ITransactionData | null
}

export default function TransactionModal({
  show,
  onClose,
  transaction,
}: TransactionModalProps): JSX.Element | null {
  const t = useTranslations('dashboard.transactionModal')

  if (!transaction) return null

  return (
    <CryModal
      show={show}
      onClose={onClose}
      title={t('title')}
      ariaLabelledBy="transaction-modal-title"
      maxWidth="max-w-xl"
    >
      {/* Inputs Section */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4m16 0l-4-4m4 4l-4 4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">{t('inputs')}</h3>
        </div>
        {transaction.inputs.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              {t('notAvailable')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transaction.inputs.map((input, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-3">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t('script')}:
                      </span>
                      <code className="block mt-1 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-md break-all text-gray-800 dark:text-gray-200">
                        {input.script}
                      </code>
                    </div>
                    {input.prev_out && (
                      <div className="space-y-2 pl-4 border-l-2 border-gray-300 dark:border-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {t('value')}:
                          </span>
                          <span className="text-sm font-mono bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-md">
                            {input.prev_out.value}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {t('txIndex')}:
                          </span>
                          <span className="text-sm font-mono bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md">
                            {input.prev_out.tx_index}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {t('n')}:
                          </span>
                          <span className="text-sm font-mono bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md">
                            {input.prev_out.n}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Outputs Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 12h16m-16 0l4-4m-4 4l4 4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">{t('outputs')}</h3>
        </div>
        {transaction.out.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500 italic">{t('notAvailable')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transaction.out.map((output, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-3">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t('value')}:
                      </span>
                      <span className="ml-2 text-sm font-mono bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-md">
                        {output.value}
                      </span>
                    </div>
                    {output.addr && (
                      <div className="mb-3">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {t('address')}:
                        </span>
                        <code className="block mt-1 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-md break-all text-gray-800 dark:text-gray-200">
                          {output.addr}
                        </code>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t('script')}:
                      </span>
                      <code className="block mt-1 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-md break-all text-gray-800 dark:text-gray-200">
                        {output.script}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </CryModal>
  )
}
