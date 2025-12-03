import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { POST } from '@/app/api/2fa/setup/verify-otp/route'
import { CookieService, RequestService } from '@/lib'

vi.mock('@/lib', () => ({
  API_URL: 'http://fake-api',
  RequestService: {
    axiosPost: vi.fn(),
  },
  createErrorResponse: (message: string, status: number) => {
    return NextResponse.json(
      {
        response: {
          isSuccess: false,
          message,
        },
      },
      { status },
    )
  },
  CookieService: {
    setJwtCookie: vi.fn(),
    setTwoFAVerifiedCookie: vi.fn(),
    clearTwoFASetUpSkippedCookie: vi.fn(),
  },
}))

class MockNextRequest {
  constructor(private body: any) {}
  async json() {
    return this.body
  }
}

describe('POST /api/2fa/setup/verify-otp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 and sets JWT cookie on success', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: {
        user: {
          id: 1,
          email: 'success@example.com',
        },
        jwt: 'valid-jwt-token',
      },
    })

    const req = new MockNextRequest({
      otp: '123456',
    })

    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.response.isSuccess).toBe(true)
    expect(body.response.message).toBe('app.messages.success.general')
    expect(body.user.email).toBe('success@example.com')

    expect(CookieService.setJwtCookie).toHaveBeenCalledWith(
      expect.any(NextResponse),
      'valid-jwt-token',
      true,
    )
    expect(CookieService.setTwoFAVerifiedCookie).toHaveBeenCalledWith(
      expect.any(NextResponse),
      'true',
      true,
    )
    expect(CookieService.clearTwoFASetUpSkippedCookie).toHaveBeenCalledWith(
      expect.any(NextResponse),
    )
  })

  it('returns 200 without setting jwt cookie if jwt is missing', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: {
        user: {
          id: 2,
          email: 'no-jwt@example.com',
        },
        jwt: null,
      },
    })

    const req = new MockNextRequest({
      otp: '654321',
    })

    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.response.isSuccess).toBe(true)
    expect(CookieService.setJwtCookie).not.toHaveBeenCalled()
  })

  it('returns 401 when response status is not 200', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 403,
      data: null,
    })

    const req = new MockNextRequest({
      otp: 'invalid',
    })

    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(401)
    expect(body.response.isSuccess).toBe(false)
    expect(body.response.message).toBe('app.messages.error.general')
  })

  it('returns 500 on unexpected error', async () => {
    ;(RequestService.axiosPost as any).mockRejectedValue(new Error('API down'))

    const req = new MockNextRequest({
      otp: '123456',
    })

    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.response.isSuccess).toBe(false)
    expect(body.response.message).toBe('app.messages.error.general')
  })
})
