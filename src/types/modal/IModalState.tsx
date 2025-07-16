import { ITransactionData, ITransactionXPUB } from '@/types'

export type IModalState =
  | { type: 'transaction'; data: ITransactionData }
  | { type: 'xpubTransaction'; data: ITransactionXPUB }
  | { type: null; data: null }
