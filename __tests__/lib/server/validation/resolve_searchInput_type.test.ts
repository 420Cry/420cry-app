import { describe, it, expect } from 'vitest'
import { resolveSearchInputType } from '@/lib'

describe('resolveSearchInputType', () => {
  it('detects TXID (64-char hex string)', () => {
    const input = 'a'.repeat(64)
    const result = resolveSearchInputType(input)
    expect(result).toEqual({ type: 'TXID', txid: input })
  })

  it('detects XPUB (valid prefix and length)', () => {
    const input = 'xpub' + '1'.repeat(100)
    const result = resolveSearchInputType(input)
    expect(result).toEqual({ type: 'XPUB', xpub: input })
  })

  it('detects SYMBOL (2-5 uppercase letters)', () => {
    const input = 'BTC'
    const result = resolveSearchInputType(input)
    expect(result).toEqual({ type: 'SYMBOL', symbol: input })
  })

  it('detects FULL_NAME (4+ letters or spaces)', () => {
    const input = 'Bitcoin'
    const result = resolveSearchInputType(input)
    expect(result).toEqual({ type: 'FULL_NAME', fullName: input })
  })

  it('returns UNKNOWN for invalid input', () => {
    const input = '123!@#'
    const result = resolveSearchInputType(input)
    expect(result).toEqual({ type: 'UNKNOWN', raw: input })
  })

  it('trims whitespace from input before checking', () => {
    const input = '   BTC   '
    const result = resolveSearchInputType(input)
    expect(result).toEqual({ type: 'SYMBOL', symbol: 'BTC' })
  })

  it('matches only full xpub-style strings (not too short)', () => {
    const input = 'xpub123' // too short
    const result = resolveSearchInputType(input)
    expect(result).toEqual({ type: 'UNKNOWN', raw: input })
  })

  it('prioritizes TXID over other types when input matches multiple patterns', () => {
    const input = 'a'.repeat(64) // Also could match FULL_NAME (alphabetic), but TXID should win
    const result = resolveSearchInputType(input)
    expect(result.type).toBe('TXID')
  })
})
