import { describe, it, expect } from 'vitest'
import {
  passwordSchema,
  emailSchema,
  usernameSchema,
  fullNameSchema,
  otpSchema,
  tokenSchema,
  passwordConfirmationSchema,
} from '@/lib/server/validation/common/commonSchemas'
import { z } from 'zod'

describe('Common Validation Schemas', () => {
  describe('passwordSchema', () => {
    const validPassword = 'Password123!'
    const invalidPasswords = [
      { password: 'short', error: 'app.rules.passwordLength' },
      { password: '12345678!', error: 'app.rules.passwordUppercase' },
      { password: 'NoNumbers!', error: 'app.rules.passwordNumberContain' },
      { password: 'NoSpecial123', error: 'app.rules.passwordSpecialContain' },
    ]

    it('passes validation with valid password', () => {
      const result = passwordSchema.safeParse(validPassword)
      expect(result.success).toBe(true)
    })

    it.each(invalidPasswords)(
      'fails validation for password: $password',
      ({ password, error }) => {
        const result = passwordSchema.safeParse(password)
        expect(result.success).toBe(false)
        expect(result.error?.errors[0]?.message).toBe(error)
      },
    )
  })

  describe('emailSchema', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'test+tag@example.org',
    ]
    const invalidEmails = [
      'invalid-email',
      '@example.com',
      'test@',
      'test.example.com',
    ]

    it.each(validEmails)('passes validation for email: %s', (email) => {
      const result = emailSchema.safeParse(email)
      expect(result.success).toBe(true)
    })

    it.each(invalidEmails)('fails validation for email: %s', (email) => {
      const result = emailSchema.safeParse(email)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0]?.message).toBe('app.rules.email')
    })
  })

  describe('usernameSchema', () => {
    const validUsernames = ['user1', 'john_doe', 'test123']
    const invalidUsernames = ['a', '', '   ']

    it.each(validUsernames)(
      'passes validation for username: %s',
      (username) => {
        const result = usernameSchema.safeParse(username)
        expect(result.success).toBe(true)
      },
    )

    it.each(invalidUsernames)(
      'fails validation for username: %s',
      (username) => {
        const result = usernameSchema.safeParse(username)
        expect(result.success).toBe(false)
        expect(result.error?.errors[0]?.message).toBe(
          'app.rules.userNameMinLength',
        )
      },
    )
  })

  describe('fullNameSchema', () => {
    const validNames = ['John Doe', 'Jane Smith', 'José García']
    const invalidNames = ['J', '', '   ']

    it.each(validNames)('passes validation for full name: %s', (name) => {
      const result = fullNameSchema.safeParse(name)
      expect(result.success).toBe(true)
    })

    it.each(invalidNames)('fails validation for full name: %s', (name) => {
      const result = fullNameSchema.safeParse(name)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0]?.message).toBe(
        'app.rules.fullNameMinLength',
      )
    })
  })

  describe('otpSchema', () => {
    const validOtps = ['123456', 'ABC123', '123']
    const invalidOtps = ['', '   ', '12345678901'] // empty, whitespace, too long

    it.each(validOtps)('passes validation for OTP: %s', (otp) => {
      const result = otpSchema.safeParse(otp)
      expect(result.success).toBe(true)
    })

    it.each(invalidOtps)('fails validation for OTP: %s', (otp) => {
      const result = otpSchema.safeParse(otp)
      expect(result.success).toBe(false)
    })
  })

  describe('tokenSchema', () => {
    const validTokens = ['abc123', 'token123', 'very-long-token-string']
    const invalidTokens = ['', '   ']

    it.each(validTokens)('passes validation for token: %s', (token) => {
      const result = tokenSchema.safeParse(token)
      expect(result.success).toBe(true)
    })

    it.each(invalidTokens)('fails validation for token: %s', (token) => {
      const result = tokenSchema.safeParse(token)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0]?.message).toBe('app.rules.tokenRequired')
    })
  })

  describe('passwordConfirmationSchema', () => {
    it('passes validation when passwords match', () => {
      const schema = passwordConfirmationSchema(passwordSchema)
      const data = {
        password: 'Password123!',
        repeatedPassword: 'Password123!',
      }

      const result = schema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('fails validation when passwords do not match', () => {
      const schema = passwordConfirmationSchema(passwordSchema)
      const data = {
        password: 'Password123!',
        repeatedPassword: 'DifferentPassword123!',
      }

      const result = schema.safeParse(data)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0]?.message).toBe(
        'app.rules.repeatedPassword',
      )
      expect(result.error?.errors[0]?.path).toEqual(['repeatedPassword'])
    })

    it('validates password field using provided schema', () => {
      const schema = passwordConfirmationSchema(passwordSchema)
      const data = {
        password: 'short', // Invalid password
        repeatedPassword: 'short',
      }

      const result = schema.safeParse(data)
      expect(result.success).toBe(false)
      // Should fail on password validation, not confirmation
      expect(result.error?.errors[0]?.path).toEqual(['password'])
    })
  })
})
