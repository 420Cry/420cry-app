import { SignInFormSchema } from '@/lib'
import { describe, it, expect } from 'vitest'

describe('SignInFormSchema', () => {
  const validData = {
    userName: 'user1',
    password: 'Passw0rd!',
    rememberMe: true,
  }

  it('passes validation with valid input', () => {
    const result = SignInFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('fails if userName is less than 2 characters', () => {
    const result = SignInFormSchema.safeParse({
      ...validData,
      userName: 'a',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.userName).toContain(
      'app.rules.userName',
    )
  })

  it('fails if password is less than 8 characters', () => {
    const result = SignInFormSchema.safeParse({
      ...validData,
      password: 'Ab1!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.password).toContain(
      'app.rules.passwordLength',
    )
  })

  it('fails if password does not contain a letter', () => {
    const result = SignInFormSchema.safeParse({
      ...validData,
      password: '12345678!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.password).toContain(
      'app.rules.passwordLetterContain',
    )
  })

  it('fails if password does not contain a number', () => {
    const result = SignInFormSchema.safeParse({
      ...validData,
      password: 'Password!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.password).toContain(
      'app.rules.passwordNumberContain',
    )
  })

  it('fails if password does not contain a special character', () => {
    const result = SignInFormSchema.safeParse({
      ...validData,
      password: 'Password1',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.password).toContain(
      'app.rules.passwordSpecialContain',
    )
  })

  it('passes if rememberMe is omitted', () => {
    const { rememberMe, ...rest } = validData
    const result = SignInFormSchema.safeParse(rest)
    expect(result.success).toBe(true)
  })

  it('fails if password is empty string', () => {
    const result = SignInFormSchema.safeParse({
      ...validData,
      password: '',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.password).toContain(
      'app.rules.passwordRequired',
    )
  })
})
