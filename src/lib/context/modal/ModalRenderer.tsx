import { JSX } from 'react'
import { TransactionModal, XPUBTransactionModal } from '@/components'
import { useModal } from '@/lib'
import { IModalState, ITransactionData, ITransactionXPUB } from '@/types'

interface ModalProps<T = unknown> {
  data: T
  onClose: () => void
}

const MODAL_COMPONENTS: Record<string, (props: ModalProps) => JSX.Element> = {
  transaction: ({ data, onClose }) => (
    <TransactionModal
      show
      transaction={data as ITransactionData | null}
      onClose={onClose}
    />
  ),
  xpubTransaction: ({ data, onClose }) => (
    <XPUBTransactionModal
      show
      transactionData={data as ITransactionXPUB | null}
      onClose={onClose}
    />
  ),
}

export function ModalRenderer(): JSX.Element | null {
  const { modal, closeModal } = useModal() as {
    modal: IModalState
    closeModal: () => void
  }

  if (!modal.type) return null

  const ModalComponent = MODAL_COMPONENTS[modal.type]
  return ModalComponent ? (
    <ModalComponent data={modal.data} onClose={closeModal} />
  ) : null
}
