'use client'

import { TransactionModal, XPUBTransactionModal } from '@/components'
import { useModal } from '@/lib'
import { JSX } from 'react'

export function ModalRenderer(): JSX.Element | null {
  const { modal, closeModal } = useModal()

  switch (modal.type) {
    case 'transaction':
      return (
        <TransactionModal show transaction={modal.data} onClose={closeModal} />
      )

    case 'xpubTransaction':
      return (
        <XPUBTransactionModal
          show
          transactionData={modal.data}
          onClose={closeModal}
        />
      )

    default:
      return null
  }
}
