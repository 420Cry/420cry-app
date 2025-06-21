import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { POST } from 'src/app/api/auth/sign-in/route'
import { handleApiError, RequestService } from '@/lib'

vi.mock('@/lib', () => ({
  handleApiError: vi.fn(),
  API_URL: 'http://fake-api',
  RequestService: {
    axiosPost: vi.fn(),
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

  it('returns a success response and sets cookie when remember is true', async () => {
    const mockJwt = 'fake-jwt-token'
    const mockUser = { id: 123, email: 'test@example.com' }

    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: { user: mockUser, jwt: mockJwt },
    })

    const req = new MockNextRequest({
      username: 'user',
      password: 'pass',
      remember: true,
    })
    const res = await POST(req as any)

    expect(res).toBeInstanceOf(NextResponse)

    const data = await res.json()
    expect(data.response.isSuccess).toBe(true)
    expect(data.user).toEqual(mockUser)

    const cookie = res.cookies.get('jwt')
    expect(cookie?.value).toBe(mockJwt)
    expect(cookie?.httpOnly).toBe(true)
    expect(cookie?.path).toBe('/')
  })

  it('returns a success response and sets a session cookie when remember is false', async () => {
    const mockJwt = 'fake-jwt-token'
    const mockUser = {
      id: 123,
      email: 'test@example.com',
      twoFAEnabled: true,
    }

    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: { user: mockUser, jwt: mockJwt },
    })

    const req = new MockNextRequest({
      username: 'user',
      password: 'pass',
      remember: false,
    })
    const res = await POST(req as any)

    expect(res).toBeInstanceOf(NextResponse)

    const data = await res.json()
    expect(data.response.isSuccess).toBe(true)
    expect(data.user).toEqual(mockUser)

    const cookie = res.cookies.get('jwt')
    expect(cookie).toBeDefined()
    expect(cookie?.value).toBe(mockJwt)
    expect(cookie?.maxAge).toBeUndefined()
  })

  it('returns a 401 response when login fails with no data', async () => {
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

  it('returns a 403 response with appropriate error message', async () => {
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
})

describe('POST /api/auth/sign-in: remember me and 2FA cookie behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const userWith2FA = { id: 1, email: 'user@example.com', twoFAEnabled: true }
  const userWithout2FA = {
    id: 2,
    email: 'user2@example.com',
    twoFAEnabled: false,
  }

  it('sets 7-day maxAge cookie if remember=true and 2FA enabled', async () => {
    const jwt = 'jwt-remember-2fa'
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: { user: userWith2FA, jwt },
    })

    const req = new MockNextRequest({
      username: 'user',
      password: 'pass',
      remember: true,
    })

    const res = await POST(req as any)
    const cookie = res.cookies.get('jwt')

    expect(cookie).toBeDefined()
    expect(cookie?.value).toBe(jwt)
    expect(cookie?.maxAge).toBe(30 * 24 * 60 * 60) // 1 month in seconds
  })

  it('sets session cookie if remember=false and 2FA enabled', async () => {
    const jwt = 'jwt-session-2fa'
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: { user: userWith2FA, jwt },
    })

    const req = new MockNextRequest({
      username: 'user',
      password: 'pass',
      remember: false,
    })

    const res = await POST(req as any)
    const cookie = res.cookies.get('jwt')

    expect(cookie).toBeDefined()
    expect(cookie?.value).toBe(jwt)
    expect(cookie?.maxAge).toBeUndefined() // session cookie has no maxAge
  })

  it('sets 10-minute maxAge cookie if 2FA disabled, regardless of remember=true', async () => {
    const jwt = 'jwt-10min-2fa-disabled'
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: { user: userWithout2FA, jwt },
    })

    const req = new MockNextRequest({
      username: 'user',
      password: 'pass',
      remember: true,
    })

    const res = await POST(req as any)
    const cookie = res.cookies.get('jwt')

    expect(cookie).toBeDefined()
    expect(cookie?.value).toBe(jwt)
    expect(cookie?.maxAge).toBe(3600)
  })

  it('sets 10-minute maxAge cookie if 2FA disabled, regardless of remember=false', async () => {
    const jwt = 'jwt-10min-2fa-disabled-false'
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: { user: userWithout2FA, jwt },
    })

    const req = new MockNextRequest({
      username: 'user',
      password: 'pass',
      remember: false,
    })

    const res = await POST(req as any)
    const cookie = res.cookies.get('jwt')

    expect(cookie).toBeDefined()
    expect(cookie?.value).toBe(jwt)
    expect(cookie?.maxAge).toBe(3600)
  })

  it('sets 10-minute maxAge cookie if 2FA disabled and remember is undefined', async () => {
    const jwt = 'jwt-10min-2fa-disabled-undefined'
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: { user: userWithout2FA, jwt },
    })

    const req = new MockNextRequest({
      username: 'user',
      password: 'pass',
      // remember omitted here
    })

    const res = await POST(req as any)
    const cookie = res.cookies.get('jwt')

    expect(cookie).toBeDefined()
    expect(cookie?.value).toBe(jwt)
    expect(cookie?.maxAge).toBe(3600)
  })
})
