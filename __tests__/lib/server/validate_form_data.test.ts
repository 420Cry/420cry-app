import { validateFormData } from '@/lib'
import { describe, it, expect } from 'vitest'
import { z } from 'zod'

describe('validateFormData', () => {
  const schema = z.object({
    name: z.string().min(2, { message: 'Name too short' }),
    age: z.number().min(18, { message: 'Must be at least 18' }),
  })

  it('returns success with parsed data on valid input', () => {
    const input = { name: 'Alice', age: 30 }
    const result = validateFormData(schema, input)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(input)
    }
  })

  it('returns failure with first error message on invalid input', () => {
    const input = { name: 'A', age: 16 }
    const result = validateFormData(schema, input)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.message).toBe('Name too short')
    }
  })

  it('returns generic message if no error message present', () => {
    // simulate an error without message (unlikely but just in case)
    const schemaWithNoMessage = z.string().refine(() => false, {
      message: undefined as unknown as string,
    })
    const result = validateFormData(schemaWithNoMessage, 'test')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.message).toBe('Invalid input')
    }
  })
})
