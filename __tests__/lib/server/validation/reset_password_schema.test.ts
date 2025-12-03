import { ResetPasswordSchema } from '@/lib/server/validation/auth/ResetPasswordSchema'
import { describe, it, expect } from 'vitest'

describe('ResetPasswordSchema', () => {
  const validData = {
    resetPasswordToken: 'valid-token',
    newPassword: 'Abcdef1!',
    repeatedPassword: 'Abcdef1!',
  }

  it('passes validation with valid input', () => {
    const result = ResetPasswordSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('fails if password is too short', () => {
    const result = ResetPasswordSchema.safeParse({
      ...validData,
      newPassword: 'A1!',
      repeatedPassword: 'A1!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.newPassword).toContain(
      'app.rules.passwordLength',
    )
  })

  it('fails if password lacks a letter', () => {
    const result = ResetPasswordSchema.safeParse({
      ...validData,
      newPassword: '12345678!',
      repeatedPassword: '12345678!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.newPassword).toContain(
      'app.rules.passwordUppercase',
    )
  })

  it('fails if password lacks a number', () => {
    const result = ResetPasswordSchema.safeParse({
      ...validData,
      newPassword: 'Password!',
      repeatedPassword: 'Password!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.newPassword).toContain(
      'app.rules.passwordNumberContain',
    )
  })

  it('fails if password lacks a special character', () => {
    const result = ResetPasswordSchema.safeParse({
      ...validData,
      newPassword: 'Password1',
      repeatedPassword: 'Password1',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.newPassword).toContain(
      'app.rules.passwordSpecialContain',
    )
  })

  it('fails if passwords do not match', () => {
    const result = ResetPasswordSchema.safeParse({
      ...validData,
      repeatedPassword: 'Different1!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.repeatedPassword).toContain(
      'app.rules.repeatedPassword',
    )
  })

  it('fails if resetPasswordToken is missing', () => {
    const { resetPasswordToken, ...rest } = validData
    const result = ResetPasswordSchema.safeParse(rest)
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.resetPasswordToken).toBeDefined()
  })
})
