import { useTranslations } from 'next-intl'
import { showToast } from '@/lib'
import { z } from 'zod'

type UseFormValidationReturn = {
  validateRequiredFields: (_formData: FormData) => boolean
  validateWithSchema: <T extends z.ZodTypeAny>(
    _schema: T,
    _data: unknown,
  ) => { success: true; data: z.infer<T> } | { success: false; message: string }
  validateOTP: (_otp: string) => boolean
  validatePasswordConfirmation: (
    _password: string,
    _confirmPassword: string,
  ) => boolean
  handleFormSubmission: <T>(
    _formData: FormData,
    _validationFn: (data: FormData) => Promise<T>,
    _successCallback?: (_result: T) => void,
    _errorCallback?: (_error: unknown) => void,
  ) => Promise<T | null>
}

/**
 * Custom hook for form validation
 * Provides consistent validation patterns across all forms
 */
export const useFormValidation = (): UseFormValidationReturn => {
  const t = useTranslations()

  /**
   * Validates that all form fields are filled
   */
  const validateRequiredFields = (formData: FormData): boolean => {
    const isEmpty = [...formData.values()].some((value) => !value)

    if (isEmpty) {
      showToast(false, t('app.messages.error.allfieldsAreRequired'))
      return false
    }

    return true
  }

  /**
   * Validates form data against a Zod schema
   */
  const validateWithSchema = <T extends z.ZodTypeAny>(
    schema: T,
    data: unknown,
  ):
    | { success: true; data: z.infer<T> }
    | { success: false; message: string } => {
    const result = schema.safeParse(data)

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || 'Invalid input'
      showToast(false, t(errorMessage))
      return {
        success: false,
        message: errorMessage,
      }
    }

    return {
      success: true,
      data: result.data,
    }
  }

  /**
   * Validates OTP input specifically
   */
  const validateOTP = (otp: string): boolean => {
    if (!otp.trim()) {
      showToast(false, t('app.messages.error.otpCannotBeEmpty'))
      return false
    }

    return true
  }

  /**
   * Validates password confirmation
   */
  const validatePasswordConfirmation = (
    password: string,
    confirmPassword: string,
  ): boolean => {
    if (password !== confirmPassword) {
      showToast(false, t('app.rules.repeatedPassword'))
      return false
    }

    return true
  }

  /**
   * Generic form submission handler with error handling
   */
  const handleFormSubmission = async <T>(
    formData: FormData,
    validationFn: (data: FormData) => Promise<T>,
    successCallback?: (result: T) => void,
    errorCallback?: (error: unknown) => void,
  ): Promise<T | null> => {
    try {
      // Validate required fields first
      if (!validateRequiredFields(formData)) {
        return null
      }

      // Execute the validation function
      const result = await validationFn(formData)

      // Execute success callback if provided
      if (successCallback) {
        successCallback(result)
      }

      return result
    } catch (error) {
      // Execute error callback if provided
      if (errorCallback) {
        errorCallback(error)
      } else {
        // Default error handling
        showToast(false, t('app.messages.error.general'))
      }

      return null
    }
  }

  return {
    validateRequiredFields,
    validateWithSchema,
    validateOTP,
    validatePasswordConfirmation,
    handleFormSubmission,
  }
}
