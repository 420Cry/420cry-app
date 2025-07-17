export interface ITransactionXPUB {
  found: boolean
  gap_limit: number
  txs: XPUBTransaction[]
}

export interface XPUBTransaction {
  txid: string
  block_height: number
  block_pos: number
  time: number // Unix timestamp (in seconds or ms, depending on source)
  balance_diff: number
  wallet_ids: string[]
  balance: number
}
