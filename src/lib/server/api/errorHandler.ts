import { NextResponse } from 'next/server'
import { createErrorResponse } from './createErrorResponse'

export interface ApiErrorContext {
  operation: string
  resource?: string
  userId?: string
}

export class ApiErrorHandler {
  /**
   * Centralized error handling for API routes
   */
  public static handle(error: unknown, context: ApiErrorContext): NextResponse {
    const err = error as { response?: { status?: number } }
    const status = err?.response?.status ?? 500

    const message = this.getErrorMessage(status, context)

    // Log error for debugging (in production, use proper logging service)
    console.error(`API Error in ${context.operation}:`, {
      status,
      message,
      resource: context.resource,
      userId: context.userId,
      error: err,
    })

    return createErrorResponse(message, status)
  }

  /**
   * Handle specific error cases with custom messages
   */
  public static handleWithCustomMessage(
    error: unknown,
    customMessage: string,
    status = 500,
  ): NextResponse {
    const err = error as { response?: { status?: number } }
    const actualStatus = err?.response?.status ?? status

    console.error('API Error with custom message:', {
      status: actualStatus,
      message: customMessage,
      error: err,
    })

    return createErrorResponse(customMessage, actualStatus)
  }

  /**
   * Handle validation errors specifically
   */
  public static handleValidationError(
    validationError: unknown,
    context: ApiErrorContext,
  ): NextResponse {
    console.error(`Validation Error in ${context.operation}:`, {
      error: validationError,
      resource: context.resource,
    })

    return createErrorResponse('app.messages.error.validationError', 422)
  }

  /**
   * Handle missing required parameters
   */
  public static handleMissingParameter(
    parameterName: string,
    context: ApiErrorContext,
  ): NextResponse {
    console.error(`Missing parameter in ${context.operation}:`, {
      parameter: parameterName,
      resource: context.resource,
    })

    return createErrorResponse(`Missing ${parameterName} parameter`, 400)
  }

  /**
   * Get appropriate error message based on status code and context
   */
  private static getErrorMessage(
    status: number,
    context: ApiErrorContext,
  ): string {
    const errorMap: Record<number, string> = {
      400: 'app.messages.error.invalidRequest',
      401: 'app.messages.error.unauthorized',
      403: 'app.messages.error.forbidden',
      404: 'app.messages.error.notFound',
      409: 'app.messages.error.conflict',
      422: 'app.messages.error.validationError',
      429: 'app.messages.error.rateLimited',
      500: 'app.messages.error.serverError',
      502: 'app.messages.error.badGateway',
      503: 'app.messages.error.serviceUnavailable',
      504: 'app.messages.error.gatewayTimeout',
    }

    // Context-specific error messages
    if (context.operation.includes('signin') && status === 401) {
      return 'app.messages.error.invalidCredentials'
    }

    if (context.operation.includes('signup') && status === 409) {
      return 'app.messages.error.emailOrUserNameAlreadyExist'
    }

    if (context.operation.includes('reset') && status === 404) {
      return 'app.messages.error.userNotFound'
    }

    if (context.operation.includes('2fa') && status === 401) {
      return 'app.messages.error.invalidOTP'
    }

    return errorMap[status] || 'app.messages.error.general'
  }
}
