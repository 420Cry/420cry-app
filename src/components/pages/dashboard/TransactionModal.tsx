'use client'

import { ITransactionData } from '@/types'
import { ArrowDownIcon, CryButton } from '@420cry/420cry-lib'
import React, { ReactElement } from 'react'
import { useTranslations } from 'next-intl'

interface TransactionModalProps {
  show: boolean
  onClose: () => void
  transaction: ITransactionData | null
}

const TransactionModal = ({
  show,
  onClose,
  transaction,
}: TransactionModalProps): ReactElement | null => {
  const t = useTranslations('dashboard.transactionModal')

  if (!show || !transaction) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-8 relative overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
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
          id="transaction-modal-title"
          className="text-2xl font-extrabold text-gray-900 mb-6"
        >
          {t('title')}
        </h2>

        {/* Inputs */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {t('inputs')}
          </h3>
          {transaction.inputs.length === 0 ? (
            <p className="text-sm text-gray-500 italic">{t('notAvailable')}</p>
          ) : (
            <ul className="space-y-3 text-sm text-gray-700">
              {transaction.inputs.map((input, idx) => (
                <li
                  key={idx}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition"
                >
                  <p>
                    <span className="font-semibold">{t('script')}: </span>
                    <code className="break-all">{input.script}</code>
                  </p>
                  {input.prev_out && (
                    <div className="mt-1 space-y-1 pl-4">
                      <p>
                        <span className="font-semibold">{t('value')}: </span>
                        {input.prev_out.value}
                      </p>
                      <p>
                        <span className="font-semibold">{t('txIndex')}: </span>
                        {input.prev_out.tx_index}
                      </p>
                      <p>
                        <span className="font-semibold">{t('n')}: </span>
                        {input.prev_out.n}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Outputs */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {t('outputs')}
          </h3>
          {transaction.out.length === 0 ? (
            <p className="text-sm text-gray-500 italic">{t('notAvailable')}</p>
          ) : (
            <ul className="space-y-3 text-sm text-gray-700">
              {transaction.out.map((output, idx) => (
                <li
                  key={idx}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition"
                >
                  <p>
                    <span className="font-semibold">{t('value')}: </span>
                    {output.value}
                  </p>
                  {output.addr && (
                    <p>
                      <span className="font-semibold">{t('address')}: </span>
                      <code className="break-all">{output.addr}</code>
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">{t('script')}: </span>
                    <code className="break-all">{output.script}</code>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default TransactionModal
