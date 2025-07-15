import { SearchInput } from '@/types'

export function resolveSearchInputType(input: string): SearchInput {
  const trimmed = input.trim()

  const isTxid = /^[a-fA-F0-9]{64}$/.test(trimmed)
  if (isTxid) {
    return { type: 'TXID', txid: trimmed }
  }

  const isXpub =
    /^(xpub|ypub|zpub|tpub|vpub|upub|ltub|mtub)[1-9A-HJ-NP-Za-km-z]{100,}$/.test(
      trimmed,
    )
  if (isXpub) {
    return { type: 'XPUB', xpub: trimmed }
  }

  const isSymbol = /^[A-Z]{2,5}$/.test(trimmed)
  if (isSymbol) {
    return { type: 'SYMBOL', symbol: trimmed }
  }

  const isFullName = /^[a-zA-Z ]{4,}$/.test(trimmed)
  if (isFullName) {
    return { type: 'FULL_NAME', fullName: trimmed }
  }

  return { type: 'UNKNOWN', raw: input }
}
