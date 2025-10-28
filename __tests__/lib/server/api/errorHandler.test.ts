import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { ApiErrorHandler } from '@/lib/server/api/errorHandler'
import { createErrorResponse } from '@/lib/server/api/createErrorResponse'

// Mock the createErrorResponse function
vi.mock('@/lib/server/api/createErrorResponse', () => ({
  createErrorResponse: vi.fn((message: string, status: number) => {
    return NextResponse.json(
      {
        response: {
          isSuccess: false,
          message,
        },
      },
      { status },
    )
  }),
}))

describe('ApiErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock console.error to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('handle', () => {
    it('handles error with response status correctly', () => {
      const error = {
        response: {
          status: 404,
        },
      }
      const context = {
        operation: 'test-operation',
        resource: 'test-resource',
      }

      const result = ApiErrorHandler.handle(error, context)

      expect(createErrorResponse).toHaveBeenCalledWith(
        'app.messages.error.notFound',
        404,
      )
      expect(console.error).toHaveBeenCalledWith(
        'API Error in test-operation:',
        expect.objectContaining({
          status: 404,
          message: 'app.messages.error.notFound',
          resource: 'test-resource',
          error,
        }),
      )
    })

    it('handles error without response status (defaults to 500)', () => {
      const error = new Error('Something went wrong')
      const context = {
        operation: 'test-operation',
        resource: 'test-resource',
      }

      const result = ApiErrorHandler.handle(error, context)

      expect(createErrorResponse).toHaveBeenCalledWith(
        'app.messages.error.serverError',
        500,
      )
    })

    it('returns context-specific error messages for signin operation', () => {
      const error = {
        response: {
          status: 401,
        },
      }
      const context = {
        operation: 'signin',
        resource: 'user',
      }

      ApiErrorHandler.handle(error, context)

      expect(createErrorResponse).toHaveBeenCalledWith(
        'app.messages.error.invalidCredentials',
        401,
      )
    })

    it('returns context-specific error messages for signup operation', () => {
      const error = {
        response: {
          status: 409,
        },
      }
      const context = {
        operation: 'signup',
        resource: 'user',
      }

      ApiErrorHandler.handle(error, context)

      expect(createErrorResponse).toHaveBeenCalledWith(
        'app.messages.error.emailOrUserNameAlreadyExist',
        409,
      )
    })

    it('returns context-specific error messages for reset operation', () => {
      const error = {
        response: {
          status: 404,
        },
      }
      const context = {
        operation: 'reset-password',
        resource: 'user',
      }

      ApiErrorHandler.handle(error, context)

      expect(createErrorResponse).toHaveBeenCalledWith(
        'app.messages.error.userNotFound',
        404,
      )
    })

    it('returns context-specific error messages for 2FA operation', () => {
      const error = {
        response: {
          status: 401,
        },
      }
      const context = {
        operation: '2fa-verify',
        resource: 'user',
      }

      ApiErrorHandler.handle(error, context)

      expect(createErrorResponse).toHaveBeenCalledWith(
        'app.messages.error.invalidOTP',
        401,
      )
    })

    it('returns generic error message for unknown status codes', () => {
      const error = {
        response: {
          status: 418, // I'm a teapot
        },
      }
      const context = {
        operation: 'test-operation',
        resource: 'test-resource',
      }

      ApiErrorHandler.handle(error, context)

      expect(createErrorResponse).toHaveBeenCalledWith(
        'app.messages.error.general',
        418,
      )
    })
  })

  describe('handleWithCustomMessage', () => {
    it('handles error with custom message and status', () => {
      const error = new Error('Custom error')
      const customMessage = 'Custom error message'
      const status = 422

      ApiErrorHandler.handleWithCustomMessage(error, customMessage, status)

      expect(createErrorResponse).toHaveBeenCalledWith(customMessage, 422)
      expect(console.error).toHaveBeenCalledWith(
        'API Error with custom message:',
        expect.objectContaining({
          status: 422,
          message: customMessage,
          error,
        }),
      )
    })

    it('uses error response status when available', () => {
      const error = {
        response: {
          status: 400,
        },
      }
      const customMessage = 'Custom error message'
      const defaultStatus = 500

      ApiErrorHandler.handleWithCustomMessage(
        error,
        customMessage,
        defaultStatus,
      )

      expect(createErrorResponse).toHaveBeenCalledWith(customMessage, 400)
    })
  })

  describe('handleValidationError', () => {
    it('handles validation errors correctly', () => {
      const validationError = {
        errors: ['Field is required'],
      }
      const context = {
        operation: 'validate-form',
        resource: 'form',
      }

      ApiErrorHandler.handleValidationError(validationError, context)

      expect(createErrorResponse).toHaveBeenCalledWith(
        'app.messages.error.validationError',
        422,
      )
      expect(console.error).toHaveBeenCalledWith(
        'Validation Error in validate-form:',
        expect.objectContaining({
          error: validationError,
          resource: 'form',
        }),
      )
    })
  })

  describe('handleMissingParameter', () => {
    it('handles missing parameter errors correctly', () => {
      const parameterName = 'email'
      const context = {
        operation: 'create-user',
        resource: 'user',
      }

      ApiErrorHandler.handleMissingParameter(parameterName, context)

      expect(createErrorResponse).toHaveBeenCalledWith(
        'Missing email parameter',
        400,
      )
      expect(console.error).toHaveBeenCalledWith(
        'Missing parameter in create-user:',
        expect.objectContaining({
          parameter: parameterName,
          resource: 'user',
        }),
      )
    })
  })
})
