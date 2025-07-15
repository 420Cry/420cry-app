'use client'

import { ITransactionXPUB } from '@/types'
import { ArrowDownIcon, CryButton } from '@420cry/420cry-lib'
import React, { ReactElement } from 'react'
import { useTranslations } from 'next-intl'

interface XPUBTransactionModalProps {
  show: boolean
  onClose: () => void
  transactionData: ITransactionXPUB | null
}

const XPUBTransactionModal = ({
  show,
  onClose,
  transactionData,
}: XPUBTransactionModalProps): ReactElement | null => {
  const t = useTranslations('dashboard.xpubTransactionModal')

  if (!show || !transactionData) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="xpub-transaction-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
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
          {t('title')}
        </h2>

        {transactionData.txs.length === 0 ? (
          <p className="text-gray-500 italic">{t('noTransactions')}</p>
        ) : (
          <ul className="space-y-4">
            {transactionData.txs.map((tx, idx) => (
              <li
                key={idx}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition text-sm text-gray-800"
              >
                <p>
                  <span className="font-semibold">{t('txid')}:</span>{' '}
                  <code className="break-all">{tx.txid}</code>
                </p>
                <p>
                  <span className="font-semibold">{t('time')}:</span>{' '}
                  {new Date(tx.time * 1000).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">{t('balanceDiff')}:</span>{' '}
                  {tx.balance_diff}
                </p>
                <p>
                  <span className="font-semibold">{t('balance')}:</span>{' '}
                  {tx.balance}
                </p>
                <p>
                  <span className="font-semibold">{t('blockHeight')}:</span>{' '}
                  {tx.block_height}
                </p>
                <p>
                  <span className="font-semibold">{t('blockPos')}:</span>{' '}
                  {tx.block_pos}
                </p>
                {tx.wallet_ids.length > 0 && (
                  <p>
                    <span className="font-semibold">{t('walletIds')}:</span>{' '}
                    {tx.wallet_ids.join(', ')}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default XPUBTransactionModal
