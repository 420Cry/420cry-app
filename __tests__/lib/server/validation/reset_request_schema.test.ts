import { ResetRequestSchema } from '@/lib/server/validation/auth/resetRequestSchema'
import { describe, it, expect } from 'vitest'

describe('ResetRequestSchema', () => {
  it('passes validation with a valid email', () => {
    const result = ResetRequestSchema.safeParse({ email: 'user@example.com' })
    expect(result.success).toBe(true)
  })

  it('fails validation if email is missing', () => {
    const result = ResetRequestSchema.safeParse({})
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.email).toBeDefined()
  })

  it('fails validation if email is empty string', () => {
    const result = ResetRequestSchema.safeParse({ email: '' })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.email).toContain(
      'app.rules.email',
    )
  })

  it('fails validation if email is invalid format', () => {
    const result = ResetRequestSchema.safeParse({ email: 'invalid-email' })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.email).toContain(
      'app.rules.email',
    )
  })

  it('trims whitespace around email', () => {
    const result = ResetRequestSchema.safeParse({
      email: '  user@example.com  ',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('user@example.com')
    }
  })
})
