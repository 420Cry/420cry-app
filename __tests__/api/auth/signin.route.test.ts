import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { POST } from 'src/app/api/auth/sign-in/route'
import { CookieService, RequestService, ApiErrorHandler } from '@/lib'

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

describe('POST /api/auth/sign-in', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('returns 401 with invalid credentials message when login fails with no data', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 401,
      data: null,
    })

    const req = new MockNextRequest({
      username: 'fail',
      password: 'wrong',
      remember: false,
    })
    const res = await POST(req as any)

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.response.isSuccess).toBe(false)
    expect(data.response.message).toBe('app.alertTitle.invalidCredentials')
  })

  it('returns 403 with generic error message on forbidden status', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 403,
      data: null,
    })

    const req = new MockNextRequest({
      username: 'fail',
      password: 'wrong',
      remember: false,
    })
    const res = await POST(req as any)

    expect(res.status).toBe(403)
    const data = await res.json()
    expect(data.response.isSuccess).toBe(false)
    expect(data.response.message).toBe('app.alertTitle.somethingWentWrong')
  })

  it('does not set cookie if JWT is missing in response', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: { user: { id: 1, email: 'nojwt@example.com' }, jwt: null },
    })

    const req = new MockNextRequest({
      username: 'test',
      password: 'test',
      remember: true,
    })
    const res = await POST(req as any)

    expect(res.cookies.get('jwt')).toBeUndefined()
  })

  it('uses ApiErrorHandler for error handling', async () => {
    const error = new Error('Network error')
    ;(RequestService.axiosPost as any).mockRejectedValue(error)
    ;(ApiErrorHandler.handle as any).mockReturnValue(
      NextResponse.json({ error: 'handled' }, { status: 500 }),
    )

    const req = new MockNextRequest({
      username: 'test',
      password: 'test',
      remember: false,
    })
    const res = await POST(req as any)

    expect(ApiErrorHandler.handle).toHaveBeenCalledWith(error, {
      operation: 'signin',
      resource: 'user',
    })
    expect(res.status).toBe(500)
  })
})

describe('POST /api/auth/sign-in: 2FA and remember me cookie behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sets session cookies when 2FA is enabled', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: {
        user: {
          id: 1,
          email: '2fa@example.com',
          twoFAEnabled: true,
        },
        jwt: 'fake-jwt-token',
      },
    })

    const req = new MockNextRequest({
      username: '2fauser',
      password: 'test',
      remember: true,
    })

    const res = await POST(req as any)

    expect(res.status).toBe(200)
    expect(CookieService.setJwtCookie).toHaveBeenCalledWith(
      expect.any(NextResponse),
      'fake-jwt-token',
      false,
    )
    expect(CookieService.setTwoFAVerifiedCookie).toHaveBeenCalledWith(
      expect.any(NextResponse),
      'false',
      false,
      expect.any(Object),
    )
  })

  it('sets persistent jwt cookie when 2FA is disabled and rememberMe is true', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: {
        user: {
          id: 2,
          email: 'no2fa@example.com',
          twoFAEnabled: false,
        },
        jwt: 'jwt-no-2fa',
      },
    })

    const req = new MockNextRequest({
      username: 'remember',
      password: 'test',
      rememberMe: true,
    })

    const res = await POST(req as any)

    expect(res.status).toBe(200)
    expect(CookieService.setJwtCookie).toHaveBeenCalledWith(
      expect.any(NextResponse),
      'jwt-no-2fa',
      true,
    )
    expect(CookieService.setTwoFAVerifiedCookie).not.toHaveBeenCalled()
  })

  it('sets session jwt cookie when 2FA is disabled and rememberMe is false', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: {
        user: {
          id: 3,
          email: 'no2fa@example.com',
          twoFAEnabled: false,
        },
        jwt: 'jwt-session',
      },
    })

    const req = new MockNextRequest({
      username: 'session',
      password: 'test',
      rememberMe: false,
    })

    const res = await POST(req as any)

    expect(res.status).toBe(200)
    expect(CookieService.setJwtCookie).toHaveBeenCalledWith(
      expect.any(NextResponse),
      'jwt-session',
      false,
    )
    expect(CookieService.setTwoFAVerifiedCookie).not.toHaveBeenCalled()
  })

  it('returns user with rememberMe flag set to true', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: {
        user: {
          id: 4,
          email: 'remember@example.com',
          twoFAEnabled: false,
        },
        jwt: 'jwt-token',
      },
    })

    const req = new MockNextRequest({
      username: 'rememberuser',
      password: 'test',
      rememberMe: true,
    })

    const res = await POST(req as any)

    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.user.rememberMe).toBe(true)
  })
})
