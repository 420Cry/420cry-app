import { NextRequest, NextResponse } from 'next/server'
import { AxiosResponse } from 'axios'
import { IResponse } from '@/types'
import { ApiErrorHandler, ApiErrorContext } from './errorHandler'
import { createErrorResponse } from './createErrorResponse'
import { createSuccessResponse } from './createSuccessResponse'

export interface RouteHandlerOptions<TRequest, TResponse> {
  operation: string
  resource?: string
  apiCall: (body: TRequest) => Promise<AxiosResponse<TResponse>>
  successMessage?: string
  defaultErrorMessage?: string
  statusHandlers?: Record<
    number,
    (response: AxiosResponse<TResponse>) => NextResponse
  >
  transformResponse?: (response: AxiosResponse<TResponse>) => NextResponse
}

/**
 * Generic API route handler that reduces boilerplate in route files
 * Handles common patterns: request parsing, error handling, status code handling
 */
export async function handleApiRoute<TRequest, TResponse = IResponse>(
  request: NextRequest,
  options: RouteHandlerOptions<TRequest, TResponse>,
): Promise<NextResponse> {
  try {
    const body = (await request.json()) as TRequest
    const response = await options.apiCall(body)

    // Custom transform function takes precedence
    if (options.transformResponse) {
      return options.transformResponse(response)
    }

    // Custom status handlers
    if (options.statusHandlers?.[response.status]) {
      return options.statusHandlers[response.status](response)
    }

    // Default success handling
    if (response.status === 200 || response.status === 201) {
      return createSuccessResponse(
        options.successMessage || 'app.messages.success.general',
        response.status,
      )
    }

    // Default error handling
    return createErrorResponse(
      options.defaultErrorMessage || 'app.messages.error.general',
      response.status,
    )
  } catch (error: unknown) {
    return ApiErrorHandler.handle(error, {
      operation: options.operation,
      resource: options.resource,
    } as ApiErrorContext)
  }
}

/**
 * Helper to create standard status handlers for common HTTP status codes
 */
export function createStatusHandlers<TResponse>(handlers: {
  success?: string
  conflict?: string
  unauthorized?: string
  notFound?: string
  default?: string
}): Record<number, (response: AxiosResponse<TResponse>) => NextResponse> {
  const statusHandlers: Record<
    number,
    (response: AxiosResponse<TResponse>) => NextResponse
  > = {}

  if (handlers.success) {
    statusHandlers[200] = () => createSuccessResponse(handlers.success!)
    statusHandlers[201] = () => createSuccessResponse(handlers.success!)
  }

  if (handlers.conflict) {
    statusHandlers[409] = () => createErrorResponse(handlers.conflict!, 409)
  }

  if (handlers.unauthorized) {
    statusHandlers[401] = () => createErrorResponse(handlers.unauthorized!, 401)
  }

  if (handlers.notFound) {
    statusHandlers[404] = () => createErrorResponse(handlers.notFound!, 404)
  }

  // Note: default handler is handled in handleApiRoute's default case
  return statusHandlers
}
