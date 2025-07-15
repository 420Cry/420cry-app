import { SignUpFormSchema } from '@/lib'
import { describe, it, expect } from 'vitest'

describe('SignUpFormSchema', () => {
  const validData = {
    fullName: 'John Doe',
    userName: 'johndoe',
    email: 'john@example.com',
    password: 'Password1!',
    repeatedPassword: 'Password1!',
  }

  it('passes validation with valid data', () => {
    const result = SignUpFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('fails if fullName is less than 2 characters', () => {
    const result = SignUpFormSchema.safeParse({
      ...validData,
      fullName: 'J',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.fullName).toContain(
      'app.rules.fullName',
    )
  })

  it('fails if userName is less than 2 characters', () => {
    const result = SignUpFormSchema.safeParse({
      ...validData,
      userName: 'a',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.userName).toContain(
      'app.rules.userName',
    )
  })

  it('fails if email is invalid', () => {
    const result = SignUpFormSchema.safeParse({
      ...validData,
      email: 'invalid-email',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.email).toContain(
      'app.rules.email',
    )
  })

  it('fails if password is less than 8 characters', () => {
    const result = SignUpFormSchema.safeParse({
      ...validData,
      password: 'Ab1!',
      repeatedPassword: 'Ab1!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.password).toContain(
      'app.rules.passwordLength',
    )
  })

  it('fails if password does not contain a letter', () => {
    const result = SignUpFormSchema.safeParse({
      ...validData,
      password: '12345678!',
      repeatedPassword: '12345678!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.password).toContain(
      'app.rules.passwordLetterContain',
    )
  })

  it('fails if password does not contain a number', () => {
    const result = SignUpFormSchema.safeParse({
      ...validData,
      password: 'Password!',
      repeatedPassword: 'Password!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.password).toContain(
      'app.rules.passwordNumberContain',
    )
  })

  it('fails if password does not contain a special character', () => {
    const result = SignUpFormSchema.safeParse({
      ...validData,
      password: 'Password1',
      repeatedPassword: 'Password1',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.password).toContain(
      'app.rules.passwordSpecialContain',
    )
  })

  it('fails if repeatedPassword does not match password', () => {
    const result = SignUpFormSchema.safeParse({
      ...validData,
      repeatedPassword: 'Different1!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.repeatedPassword).toContain(
      'app.rules.repeatedPassword',
    )
  })
})
