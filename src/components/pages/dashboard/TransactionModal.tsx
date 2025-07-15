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

      {/* Outputs Section */}
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
    </CryModal>
  )
}
