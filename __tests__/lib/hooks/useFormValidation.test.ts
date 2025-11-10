import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFormValidation } from '@/lib/hooks/useFormValidation'
import { showToast } from '@/lib/utils/showToast'

// Mock the showToast function
vi.mock('@/lib/utils/showToast', () => ({
  showToast: vi.fn(),
}))

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key, // Return the key as the translation
}))

describe('useFormValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('validateRequiredFields', () => {
    it('returns true when all fields are filled', () => {
      const { result } = renderHook(() => useFormValidation())
      const formData = new FormData()
      formData.append('field1', 'value1')
      formData.append('field2', 'value2')

      const isValid = result.current.validateRequiredFields(formData)

      expect(isValid).toBe(true)
      expect(showToast).not.toHaveBeenCalled()
    })

    it('returns false and shows toast when any field is empty', () => {
      const { result } = renderHook(() => useFormValidation())
      const formData = new FormData()
      formData.append('field1', 'value1')
      formData.append('field2', '') // Empty field

      const isValid = result.current.validateRequiredFields(formData)

      expect(isValid).toBe(false)
      expect(showToast).toHaveBeenCalledWith(
        false,
        'app.messages.error.allfieldsAreRequired',
      )
    })

    it('returns false when all fields are empty', () => {
      const { result } = renderHook(() => useFormValidation())
      const formData = new FormData()
      formData.append('field1', '')
      formData.append('field2', '')

      const isValid = result.current.validateRequiredFields(formData)

      expect(isValid).toBe(false)
      expect(showToast).toHaveBeenCalledWith(
        false,
        'app.messages.error.allfieldsAreRequired',
      )
    })
  })

  describe('validateWithSchema', () => {
    it('returns success when validation passes', () => {
      const { result } = renderHook(() => useFormValidation())
      const schema = {
        safeParse: vi.fn().mockReturnValue({
          success: true,
          data: { field: 'value' },
        }),
      }

      const validationResult = result.current.validateWithSchema(
        schema as any,
        { field: 'value' },
      )

      expect(validationResult.success).toBe(true)
      expect(validationResult.data).toEqual({ field: 'value' })
      expect(showToast).not.toHaveBeenCalled()
    })

    it('returns failure and shows toast when validation fails', () => {
      const { result } = renderHook(() => useFormValidation())
      const schema = {
        safeParse: vi.fn().mockReturnValue({
          success: false,
          error: {
            errors: [{ message: 'Invalid input' }],
          },
        }),
      }

      const validationResult = result.current.validateWithSchema(
        schema as any,
        { field: 'invalid' },
      )

      expect(validationResult.success).toBe(false)
      expect(validationResult.message).toBe('Invalid input')
      expect(showToast).toHaveBeenCalledWith(false, 'Invalid input')
    })

    it('handles validation error without message', () => {
      const { result } = renderHook(() => useFormValidation())
      const schema = {
        safeParse: vi.fn().mockReturnValue({
          success: false,
          error: {
            errors: [],
          },
        }),
      }

      const validationResult = result.current.validateWithSchema(
        schema as any,
        { field: 'invalid' },
      )

      expect(validationResult.success).toBe(false)
      expect(validationResult.message).toBe('Invalid input')
    })
  })

  describe('validateOTP', () => {
    it('returns true for valid OTP', () => {
      const { result } = renderHook(() => useFormValidation())

      const isValid = result.current.validateOTP('123456')

      expect(isValid).toBe(true)
      expect(showToast).not.toHaveBeenCalled()
    })

    it('returns false and shows toast for empty OTP', () => {
      const { result } = renderHook(() => useFormValidation())

      const isValid = result.current.validateOTP('')

      expect(isValid).toBe(false)
      expect(showToast).toHaveBeenCalledWith(
        false,
        'app.messages.error.otpCannotBeEmpty',
      )
    })

    it('returns false and shows toast for whitespace-only OTP', () => {
      const { result } = renderHook(() => useFormValidation())

      const isValid = result.current.validateOTP('   ')

      expect(isValid).toBe(false)
      expect(showToast).toHaveBeenCalledWith(
        false,
        'app.messages.error.otpCannotBeEmpty',
      )
    })
  })

  describe('validatePasswordConfirmation', () => {
    it('returns true when passwords match', () => {
      const { result } = renderHook(() => useFormValidation())

      const isValid = result.current.validatePasswordConfirmation(
        'password123',
        'password123',
      )

      expect(isValid).toBe(true)
      expect(showToast).not.toHaveBeenCalled()
    })

    it('returns false and shows toast when passwords do not match', () => {
      const { result } = renderHook(() => useFormValidation())

      const isValid = result.current.validatePasswordConfirmation(
        'password123',
        'different123',
      )

      expect(isValid).toBe(false)
      expect(showToast).toHaveBeenCalledWith(
        false,
        'app.rules.repeatedPassword',
      )
    })
  })

  describe('handleFormSubmission', () => {
    it('executes validation function and success callback when validation passes', async () => {
      const { result } = renderHook(() => useFormValidation())
      const mockValidationFn = vi.fn().mockResolvedValue('success')
      const mockSuccessCallback = vi.fn()
      const formData = new FormData()
      formData.append('field', 'value')

      let submissionResult: any
      await act(async () => {
        submissionResult = await result.current.handleFormSubmission(
          formData,
          mockValidationFn,
          mockSuccessCallback,
        )
      })

      expect(mockValidationFn).toHaveBeenCalledWith(formData)
      expect(mockSuccessCallback).toHaveBeenCalledWith('success')
      expect(submissionResult).toBe('success')
      expect(showToast).not.toHaveBeenCalled()
    })

    it('returns null and shows toast when required fields validation fails', async () => {
      const { result } = renderHook(() => useFormValidation())
      const mockValidationFn = vi.fn()
      const formData = new FormData()
      formData.append('field', '') // Empty field

      let submissionResult: any
      await act(async () => {
        submissionResult = await result.current.handleFormSubmission(
          formData,
          mockValidationFn,
        )
      })

      expect(mockValidationFn).not.toHaveBeenCalled()
      expect(submissionResult).toBe(null)
      expect(showToast).toHaveBeenCalledWith(
        false,
        'app.messages.error.allfieldsAreRequired',
      )
    })

    it('handles validation function errors and executes error callback', async () => {
      const { result } = renderHook(() => useFormValidation())
      const mockValidationFn = vi
        .fn()
        .mockRejectedValue(new Error('Validation failed'))
      const mockErrorCallback = vi.fn()
      const formData = new FormData()
      formData.append('field', 'value')

      let submissionResult: any
      await act(async () => {
        submissionResult = await result.current.handleFormSubmission(
          formData,
          mockValidationFn,
          undefined,
          mockErrorCallback,
        )
      })

      expect(mockValidationFn).toHaveBeenCalledWith(formData)
      expect(mockErrorCallback).toHaveBeenCalledWith(expect.any(Error))
      expect(submissionResult).toBe(null)
    })

    it('shows default error toast when validation function fails and no error callback provided', async () => {
      const { result } = renderHook(() => useFormValidation())
      const mockValidationFn = vi
        .fn()
        .mockRejectedValue(new Error('Validation failed'))
      const formData = new FormData()
      formData.append('field', 'value')

      let submissionResult: any
      await act(async () => {
        submissionResult = await result.current.handleFormSubmission(
          formData,
          mockValidationFn,
        )
      })

      expect(mockValidationFn).toHaveBeenCalledWith(formData)
      expect(submissionResult).toBe(null)
      expect(showToast).toHaveBeenCalledWith(
        false,
        'app.messages.error.general',
      )
    })
  })
})
