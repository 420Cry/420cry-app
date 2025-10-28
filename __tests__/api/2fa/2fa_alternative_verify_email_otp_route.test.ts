import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { POST } from 'src/app/api/2fa/alternative/verify-email-otp/route'
import { RequestService, CookieService } from '@/lib'

vi.mock('@/lib', () => ({
  API_URL: 'http://fake-api',
  RequestService: {
    axiosPost: vi.fn(),
  },
  CookieService: {
    setJwtCookie: vi.fn(),
    setTwoFAVerifiedCookie: vi.fn(),
  },
  createErrorResponse: vi.fn((message: string, status: number) => {
    return NextResponse.json(
      { response: { isSuccess: false, message } },
      { status },
    )
  }),
}))

class MockNextRequest {
  constructor(private body: any) {}
  async json() {
    return this.body
  }
}

describe('POST /api/2fa/alternative/verify-email-otp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 and sets cookies when rememberMe is true', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: { jwt: 'jwt-token' },
    })

    const req = new MockNextRequest({ otp: '123456', rememberMe: true })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.response.isSuccess).toBe(true)
    expect(body.response.message).toBe(
      'app.messages.success.2FAVerifySuccessful',
    )

    expect(CookieService.setJwtCookie).toHaveBeenCalledWith(
      expect.any(NextResponse),
      'jwt-token',
      true,
    )
    expect(CookieService.setTwoFAVerifiedCookie).toHaveBeenCalledWith(
      expect.any(NextResponse),
      'true',
      true,
    )
  })

  it('returns 200 and sets session cookies when rememberMe is false', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: { jwt: 'jwt-token' },
    })

    const req = new MockNextRequest({ otp: '123456', rememberMe: false })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.response.isSuccess).toBe(true)
    expect(body.response.message).toBe(
      'app.messages.success.2FAVerifySuccessful',
    )

    expect(CookieService.setJwtCookie).toHaveBeenCalledWith(
      expect.any(NextResponse),
      'jwt-token',
      false,
    )
    expect(CookieService.setTwoFAVerifiedCookie).toHaveBeenCalledWith(
      expect.any(NextResponse),
      'true',
      false,
    )
  })

  it('returns 401 with invalid OTP', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 401,
      data: null,
    })

    const req = new MockNextRequest({ otp: 'wrong', rememberMe: false })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(401)
    expect(body.response.isSuccess).toBe(false)
    expect(body.response.message).toBe('app.messages.error.invalidOTP')

    expect(CookieService.setJwtCookie).not.toHaveBeenCalled()
    expect(CookieService.setTwoFAVerifiedCookie).not.toHaveBeenCalled()
  })

  it('returns error for non-200, non-401 status', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 500,
      data: null,
    })

    const req = new MockNextRequest({ otp: 'error', rememberMe: false })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.response.isSuccess).toBe(false)
    expect(body.response.message).toBe('app.messages.error.general')
  })

  it('returns 401 from caught error with status 401', async () => {
    ;(RequestService.axiosPost as any).mockRejectedValue({
      response: { status: 401 },
    })

    const req = new MockNextRequest({ otp: 'caught', rememberMe: false })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(401)
    expect(body.response.isSuccess).toBe(false)
    expect(body.response.message).toBe('app.messages.error.invalidOTP')
  })

  it('returns 500 from caught unknown error', async () => {
    ;(RequestService.axiosPost as any).mockRejectedValue(
      new Error('network error'),
    )

    const req = new MockNextRequest({ otp: 'unknown', rememberMe: false })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.response.isSuccess).toBe(false)
    expect(body.response.message).toBe('app.messages.error.general')
  })
})
