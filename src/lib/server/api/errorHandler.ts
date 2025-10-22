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

    return createErrorResponse('app.alertTitle.validationError', 422)
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
      400: 'app.alertTitle.invalidRequest',
      401: 'app.alertTitle.unauthorized',
      403: 'app.alertTitle.forbidden',
      404: 'app.alertTitle.notFound',
      409: 'app.alertTitle.conflict',
      422: 'app.alertTitle.validationError',
      429: 'app.alertTitle.rateLimited',
      500: 'app.alertTitle.serverError',
      502: 'app.alertTitle.badGateway',
      503: 'app.alertTitle.serviceUnavailable',
      504: 'app.alertTitle.gatewayTimeout',
    }

    // Context-specific error messages
    if (context.operation.includes('signin') && status === 401) {
      return 'app.alertTitle.invalidCredentials'
    }

    if (context.operation.includes('signup') && status === 409) {
      return 'app.alertTitle.emailOrUserNameAlreadyExist'
    }

    if (context.operation.includes('reset') && status === 404) {
      return 'app.alertTitle.userNotFound'
    }

    if (context.operation.includes('2fa') && status === 401) {
      return 'app.alertTitle.invalidOTP'
    }

    return errorMap[status] || 'app.alertTitle.somethingWentWrong'
  }
}
