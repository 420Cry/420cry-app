export interface ITransactionData {
  found: boolean
  label: string
  txid: string
  is_coinbase: boolean
  wallet_id: string
  block_height: number
  block_pos: number
  time: number
  size: number
  in: unknown
  out: unknown
  updated_to_block: number
}
