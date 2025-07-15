export interface ITransactionData {
  hash: string
  ver: number
  vin_sz: number
  vout_sz: number
  lock_time: number | string
  size: number
  weight?: number
  fee?: number
  relayed_by: string
  block_height: number
  block_index?: number
  tx_index: number | string
  double_spend?: boolean
  time: number
  inputs: ITransactionInput[]
  out: ITransactionOutput[]
}

export interface ITransactionInput {
  sequence?: number
  witness?: string
  script: string
  index?: number
  prev_out?: {
    type?: number
    spent?: boolean
    value: number | string
    spending_outpoints: {
      tx_index: number | string
      n: number
    }[]
    n: number | string
    tx_index: number | string
    script: string
  }
}

export interface ITransactionOutput {
  type?: number
  spent?: boolean
  value: number | string
  spending_outpoints?: {
    tx_index: number | string
    n: number
  }[]
  n?: number
  tx_index: number | string
  script: string
  addr?: string
}
