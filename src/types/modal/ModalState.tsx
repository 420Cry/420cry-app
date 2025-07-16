import { ITransactionData, ITransactionXPUB } from '@/types'

export type ModalState =
  | { type: 'transaction'; data: ITransactionData }
  | { type: 'xpubTransaction'; data: ITransactionXPUB }
  | { type: null; data: null }
