export type InputType = 'TXID' | 'XPUB' | 'SYMBOL' | 'FULL_NAME' | 'UNKNOWN'

export interface BaseInput {
  type: InputType
}

export interface TxidInput extends BaseInput {
  type: 'TXID'
  txid: string
}

export interface XpubInput extends BaseInput {
  type: 'XPUB'
  xpub: string
}

export interface SymbolInput extends BaseInput {
  type: 'SYMBOL'
  symbol: string
}

export interface FullNameInput extends BaseInput {
  type: 'FULL_NAME'
  fullName: string
}

export interface UnknownInput extends BaseInput {
  type: 'UNKNOWN'
  raw: string
}

// Union type
export type SearchInput =
  | TxidInput
  | XpubInput
  | SymbolInput
  | FullNameInput
  | UnknownInput
