import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { POST } from 'src/app/api/auth/reset-request/route'
import { RequestService } from '@/lib'
import { ApiErrorHandler } from '@/lib/server/api/errorHandler'

// Mock ApiErrorHandler at the module level where routeHelpers imports it
vi.mock('@/lib/server/api/errorHandler', () => ({
  ApiErrorHandler: {
    handle: vi.fn(),
  },
}))

vi.mock('@/lib', async () => {
  const actual = await vi.importActual('@/lib')
  return {
    ...actual,
    API_URL: 'http://fake-api',
    RequestService: {
      axiosPost: vi.fn(),
    },
  }
})

class MockNextRequest {
  constructor(private body: any) {}
  async json() {
    return this.body
  }
}

describe('POST /api/auth/reset-request', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns success JSON when status is 200', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 200 })

    const req = new MockNextRequest({ email: 'test@example.com' })
    const res = await POST(req as any)

    const json = await res.json()
    expect(json).toEqual({
      isSuccess: true,
      message: 'app.messages.success.resetRequestSuccess',
    })
  })

  it('sends the correct body to RequestService.axiosPost', async () => {
    const mockBody = { email: 'test@example.com' }
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 200 })

    const req = new MockNextRequest(mockBody)
    await POST(req as any)

    expect(RequestService.axiosPost).toHaveBeenCalledWith(
      'http://fake-api/api/v1/users/reset-password',
      mockBody,
    )
  })

  it('returns error JSON when status is not 200', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 400 })

    const req = new MockNextRequest({ email: 'test@example.com' })
    const res = await POST(req as any)

    const json = await res.json()
    // createErrorResponse wraps the response
    expect(json).toEqual({
      response: {
        isSuccess: false,
        message: 'app.messages.error.general',
      },
    })
  })

  it('uses ApiErrorHandler for error handling', async () => {
    const error = new Error('Network error')
    ;(RequestService.axiosPost as any).mockRejectedValue(error)
    ;(ApiErrorHandler.handle as any).mockReturnValue(
      NextResponse.json({ error: 'handled' }, { status: 500 }),
    )

    const req = new MockNextRequest({ email: 'test@example.com' })
    const res = await POST(req as any)

    expect(ApiErrorHandler.handle).toHaveBeenCalledWith(error, {
      operation: 'reset-request',
      resource: 'user',
    })
    expect(res.status).toBe(500)
  })

  it('returns a NextResponse instance', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 200 })

    const req = new MockNextRequest({ email: 'test@example.com' })
    const res = await POST(req as any)

    expect(res).toBeInstanceOf(NextResponse)
  })
})
