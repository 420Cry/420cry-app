'use client'

import { ITransactionData } from '@/types'
import { CryButton } from '@420cry/420cry-lib'
import React, { ReactElement } from 'react'
import { useTranslations } from 'next-intl'

interface TransactionModalProps {
  show: boolean
  onClose: () => void
  data: ITransactionData | null
}

const TransactionModal = ({
  show,
  onClose,
  data,
}: TransactionModalProps): ReactElement | null => {
  const t = useTranslations('dashboard.transactionModal')

  if (!show || !data) return null

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm"
      onClick={onClose}
      style={{ position: 'absolute' }}
    >
      <div
        className="bg-white bg-opacity-90 rounded-lg shadow-xl max-w-lg w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '80vh', overflowY: 'auto' }}
      >
        {/* Close Button */}
        <CryButton
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          aria-label={t('closeButtonAriaLabel')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </CryButton>

        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          {t('title')}
        </h2>

        <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
          <div>
            <strong>{t('found')}:</strong> {data.found ? t('yes') : t('no')}
          </div>
          <div>
            <strong>{t('label')}:</strong> {data.label || t('notAvailable')}
          </div>
          <div className="col-span-2 break-all">
            <strong>{t('txid')}:</strong>{' '}
            <code>{data.txid || t('notAvailable')}</code>
          </div>
          <div>
            <strong>{t('coinbase')}:</strong>{' '}
            {data.is_coinbase ? t('yes') : t('no')}
          </div>
          <div>
            <strong>{t('walletId')}:</strong>{' '}
            {data.wallet_id || t('notAvailable')}
          </div>
          <div>
            <strong>{t('blockHeight')}:</strong> {data.block_height}
          </div>
          <div>
            <strong>{t('blockPosition')}:</strong> {data.block_pos}
          </div>
          <div>
            <strong>{t('time')}:</strong>{' '}
            {new Date(data.time * 1000).toLocaleString()}
          </div>
          <div>
            <strong>{t('size')}:</strong> {data.size} bytes
          </div>
          <div className="col-span-2">
            <strong>{t('inputs')}:</strong>
            <pre className="max-h-24 overflow-auto p-2 bg-gray-100 rounded text-xs">
              {JSON.stringify(data.in, null, 2)}
            </pre>
          </div>
          <div className="col-span-2">
            <strong>{t('outputs')}:</strong>
            <pre className="max-h-24 overflow-auto p-2 bg-gray-100 rounded text-xs">
              {JSON.stringify(data.out, null, 2)}
            </pre>
          </div>
          <div className="col-span-2">
            <strong>{t('updatedToBlock')}:</strong> {data.updated_to_block}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionModal
