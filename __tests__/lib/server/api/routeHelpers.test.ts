import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { AxiosResponse } from 'axios'
import {
  handleApiRoute,
  createStatusHandlers,
} from '@/lib/server/api/routeHelpers'
import {
  ApiErrorHandler,
  createErrorResponse,
  createSuccessResponse,
} from '@/lib'
import { IResponse } from '@/types'

vi.mock('@/lib/server/api/errorHandler', () => ({
  ApiErrorHandler: {
    handle: vi.fn(),
  },
}))

vi.mock('@/lib/server/api/createErrorResponse', () => ({
  createErrorResponse: vi.fn(),
}))

vi.mock('@/lib/server/api/createSuccessResponse', () => ({
  createSuccessResponse: vi.fn(),
}))

class MockNextRequest {
  constructor(private body: any) {}
  async json() {
    return this.body
  }
}

describe('handleApiRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls apiCall with request body and returns success response', async () => {
    const mockResponse: AxiosResponse<IResponse> = {
      status: 200,
      data: { isSuccess: true, message: 'Success' },
      statusText: 'OK',
      headers: {},
      config: {} as any,
    }

    const mockApiCall = vi.fn().mockResolvedValue(mockResponse)
    ;(createSuccessResponse as any).mockReturnValue(
      NextResponse.json({
        isSuccess: true,
        message: 'app.messages.success.general',
      }),
    )

    const req = new MockNextRequest({ test: 'data' })
    const result = await handleApiRoute(req as any, {
      operation: 'test',
      apiCall: mockApiCall,
      successMessage: 'app.messages.success.general',
    })

    expect(mockApiCall).toHaveBeenCalledWith({ test: 'data' })
    expect(createSuccessResponse).toHaveBeenCalledWith(
      'app.messages.success.general',
      200,
    )
  })

  it('uses custom status handlers when provided', async () => {
    const mockResponse: AxiosResponse<IResponse> = {
      status: 409,
      data: { isSuccess: false, message: 'Conflict' },
      statusText: 'Conflict',
      headers: {},
      config: {} as any,
    }

    const mockApiCall = vi.fn().mockResolvedValue(mockResponse)
    const statusHandlers = {
      409: () => createErrorResponse('app.messages.error.conflict', 409),
    }
    ;(createErrorResponse as any).mockReturnValue(
      NextResponse.json(
        { isSuccess: false, message: 'app.messages.error.conflict' },
        { status: 409 },
      ),
    )

    const req = new MockNextRequest({ test: 'data' })
    await handleApiRoute(req as any, {
      operation: 'test',
      apiCall: mockApiCall,
      statusHandlers,
    })

    expect(createErrorResponse).toHaveBeenCalledWith(
      'app.messages.error.conflict',
      409,
    )
  })

  it('uses transformResponse when provided', async () => {
    const mockResponse: AxiosResponse<IResponse> = {
      status: 200,
      data: { isSuccess: true, message: 'Success' },
      statusText: 'OK',
      headers: {},
      config: {} as any,
    }

    const mockApiCall = vi.fn().mockResolvedValue(mockResponse)
    const transformResponse = vi
      .fn()
      .mockReturnValue(NextResponse.json({ transformed: true }))

    const req = new MockNextRequest({ test: 'data' })
    const result = await handleApiRoute(req as any, {
      operation: 'test',
      apiCall: mockApiCall,
      transformResponse,
    })

    expect(transformResponse).toHaveBeenCalledWith(mockResponse)
    expect(createSuccessResponse).not.toHaveBeenCalled()
  })

  it('handles errors using ApiErrorHandler', async () => {
    const error = new Error('Network error')
    const mockApiCall = vi.fn().mockRejectedValue(error)
    ;(ApiErrorHandler.handle as any).mockReturnValue(
      NextResponse.json({ error: 'handled' }, { status: 500 }),
    )

    const req = new MockNextRequest({ test: 'data' })
    const result = await handleApiRoute(req as any, {
      operation: 'test',
      apiCall: mockApiCall,
    })

    expect(ApiErrorHandler.handle).toHaveBeenCalledWith(error, {
      operation: 'test',
      resource: undefined,
    })
  })

  it('uses defaultErrorMessage for non-success status codes', async () => {
    const mockResponse: AxiosResponse<IResponse> = {
      status: 500,
      data: { isSuccess: false, message: 'Error' },
      statusText: 'Internal Server Error',
      headers: {},
      config: {} as any,
    }

    const mockApiCall = vi.fn().mockResolvedValue(mockResponse)
    ;(createErrorResponse as any).mockReturnValue(
      NextResponse.json(
        { isSuccess: false, message: 'custom.error' },
        { status: 500 },
      ),
    )

    const req = new MockNextRequest({ test: 'data' })
    await handleApiRoute(req as any, {
      operation: 'test',
      apiCall: mockApiCall,
      defaultErrorMessage: 'custom.error',
    })

    expect(createErrorResponse).toHaveBeenCalledWith('custom.error', 500)
  })
})

describe('createStatusHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates handlers for success status codes', () => {
    const handlers = createStatusHandlers({
      success: 'app.messages.success.test',
    })

    expect(handlers[200]).toBeDefined()
    expect(handlers[201]).toBeDefined()

    const response = { status: 200 } as AxiosResponse<any>
    handlers[200](response)
    expect(createSuccessResponse).toHaveBeenCalledWith(
      'app.messages.success.test',
    )
  })

  it('creates handler for conflict status code', () => {
    const handlers = createStatusHandlers({
      conflict: 'app.messages.error.conflict',
    })

    expect(handlers[409]).toBeDefined()

    const response = { status: 409 } as AxiosResponse<any>
    handlers[409](response)
    expect(createErrorResponse).toHaveBeenCalledWith(
      'app.messages.error.conflict',
      409,
    )
  })

  it('creates handler for unauthorized status code', () => {
    const handlers = createStatusHandlers({
      unauthorized: 'app.messages.error.unauthorized',
    })

    expect(handlers[401]).toBeDefined()

    const response = { status: 401 } as AxiosResponse<any>
    handlers[401](response)
    expect(createErrorResponse).toHaveBeenCalledWith(
      'app.messages.error.unauthorized',
      401,
    )
  })

  it('creates handler for notFound status code', () => {
    const handlers = createStatusHandlers({
      notFound: 'app.messages.error.notFound',
    })

    expect(handlers[404]).toBeDefined()

    const response = { status: 404 } as AxiosResponse<any>
    handlers[404](response)
    expect(createErrorResponse).toHaveBeenCalledWith(
      'app.messages.error.notFound',
      404,
    )
  })

  it('creates multiple handlers when multiple options are provided', () => {
    const handlers = createStatusHandlers({
      success: 'app.messages.success.test',
      conflict: 'app.messages.error.conflict',
      unauthorized: 'app.messages.error.unauthorized',
    })

    expect(handlers[200]).toBeDefined()
    expect(handlers[201]).toBeDefined()
    expect(handlers[409]).toBeDefined()
    expect(handlers[401]).toBeDefined()
  })
})
