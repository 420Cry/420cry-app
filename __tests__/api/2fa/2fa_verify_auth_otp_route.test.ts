import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { POST } from 'src/app/api/2fa/verify/route'
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
  },
}))

class MockNextRequest {
  constructor(private body: any) {}
  async json() {
    return this.body
  }
}

describe('POST /api/2fa/auth/verify-otp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 and sets persistent cookies when remember is true', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: {
        jwt: 'jwt-token',
      },
    })

    const req = new MockNextRequest({ otp: '123456', rememberMe: true })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.response.isSuccess).toBe(true)
    expect(body.response.message).toBe('app.alertTitle.2FAVerifySuccessful')

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

  it('returns 200 and sets session cookies when remember is false', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: {
        jwt: 'jwt-token',
      },
    })

    const req = new MockNextRequest({ otp: '123456', rememberMe: false })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.response.message).toBe('app.alertTitle.2FAVerifySuccessful')

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

  it('returns 401 with invalid OTP message', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 401,
      data: null,
    })

    const req = new MockNextRequest({ otp: 'wrong', remember: false })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(401)
    expect(body.response.isSuccess).toBe(false)
    expect(body.response.message).toBe('app.alertTitle.invalidOTP')

    expect(CookieService.setJwtCookie).not.toHaveBeenCalled()
    expect(CookieService.setTwoFAVerifiedCookie).not.toHaveBeenCalled()
  })

  it('returns error response for other non-200 statuses', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 500,
      data: null,
    })

    const req = new MockNextRequest({ otp: '500err', remember: false })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.response.isSuccess).toBe(false)
    expect(body.response.message).toBe('app.alertTitle.somethingWentWrong')
  })

  it('returns 401 from caught error with status 401', async () => {
    ;(RequestService.axiosPost as any).mockRejectedValue({
      response: {
        status: 401,
      },
    })

    const req = new MockNextRequest({ otp: 'caught', remember: false })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(401)
    expect(body.response.message).toBe('app.alertTitle.invalidOTP')
  })

  it('returns 500 from caught unknown error', async () => {
    ;(RequestService.axiosPost as any).mockRejectedValue(
      new Error('network error'),
    )

    const req = new MockNextRequest({ otp: 'unknown', remember: false })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.response.message).toBe('app.alertTitle.somethingWentWrong')
  })
})
