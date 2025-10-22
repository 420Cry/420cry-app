import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { POST } from 'src/app/api/auth/sign-up/route'
import { RequestService, ApiErrorHandler } from '@/lib'

vi.mock('@/lib', () => ({
  API_URL: 'http://fake-api',
  RequestService: {
    axiosPost: vi.fn(),
  },
  ApiErrorHandler: {
    handle: vi.fn(),
  },
}))

class MockNextRequest {
  constructor(private body: any) {}
  async json() {
    return this.body
  }
}

describe('POST route handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns success JSON when status is 200', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 200 })

    const req = new MockNextRequest({ some: 'data' })
    const res = await POST(req as any)

    const json = await res.json()
    expect(json).toEqual({
      isSuccess: true,
      message: 'app.alertTitle.Successful',
    })
  })

  it('returns success JSON when status is 201', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 201 })

    const req = new MockNextRequest({ some: 'data' })
    const res = await POST(req as any)

    const json = await res.json()
    expect(json).toEqual({
      isSuccess: true,
      message: 'app.alertTitle.Successful',
    })
  })

  it('returns failure JSON when status is not 200 or 201', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 400 })

    const req = new MockNextRequest({ some: 'data' })
    const res = await POST(req as any)

    const json = await res.json()
    expect(json).toEqual({
      isSuccess: false,
      message: 'app.alertTitle.somethingWentWrong',
    })
  })

  it('sends the correct body to RequestService.axiosPost', async () => {
    const mockBody = { email: 'test@example.com', password: '123456' }
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 200 })

    const req = new MockNextRequest(mockBody)
    await POST(req as any)

    expect(RequestService.axiosPost).toHaveBeenCalledWith(
      'http://fake-api/users/signup',
      mockBody,
    )
  })

  it('handles empty request body', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 400 })

    const req = new MockNextRequest({})
    const res = await POST(req as any)

    const json = await res.json()
    expect(json).toEqual({
      isSuccess: false,
      message: 'app.alertTitle.somethingWentWrong',
    })
  })

  it('returns a NextResponse instance', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 200 })

    const req = new MockNextRequest({ some: 'data' })
    const res = await POST(req as any)

    expect(res).toBeInstanceOf(NextResponse)
  })

  it('uses ApiErrorHandler for error handling', async () => {
    const error = new Error('Network error')
    ;(RequestService.axiosPost as any).mockRejectedValue(error)
    ;(ApiErrorHandler.handle as any).mockReturnValue(
      NextResponse.json({ error: 'handled' }, { status: 500 }),
    )

    const req = new MockNextRequest({ some: 'data' })
    const res = await POST(req as any)

    expect(ApiErrorHandler.handle).toHaveBeenCalledWith(error, {
      operation: 'signup',
      resource: 'user',
    })
    expect(res.status).toBe(500)
  })
})

it('returns failure JSON when status is 400', async () => {
  ;(RequestService.axiosPost as any).mockResolvedValue({ status: 400 })

  const req = new MockNextRequest({ some: 'data' })
  const res = await POST(req as any)

  const json = await res.json()
  expect(json).toEqual({
    isSuccess: false,
    message: 'app.alertTitle.somethingWentWrong',
  })
})

it('returns failure JSON when status is 409 (Conflict)', async () => {
  ;(RequestService.axiosPost as any).mockResolvedValue({ status: 409 })

  const req = new MockNextRequest({ some: 'data' })
  const res = await POST(req as any)

  const json = await res.json()
  expect(json).toEqual({
    isSuccess: false,
    message: 'app.alertTitle.emailOrUserNameAlreadyExist',
  })
})
