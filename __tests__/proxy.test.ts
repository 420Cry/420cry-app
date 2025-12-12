import { describe, it, expect, vi, beforeEach } from 'vitest'
import { jwtVerify } from 'jose'
import { proxy } from '@/proxy'
import {
  AUTH_ROUTES,
  BLOCKED_ROUTES_FOR_AUTH_USERS,
  HOME_ROUTE,
  SIGN_IN_ROUTE,
  TWO_FACTOR_SETUP_ROUTE,
} from '@/lib'

vi.mock('jose', () => ({
  jwtVerify: vi.fn(),
}))

vi.mock('./lib', async () => ({
  AUTH_ROUTES,
  BLOCKED_ROUTES_FOR_AUTH_USERS,
  SIGN_IN_ROUTE,
  HOME_ROUTE,
}))

function mockRequest(
  pathname: string,
  jwt?: string,
  cookiesObj?: Record<string, string>,
) {
  return {
    nextUrl: {
      pathname,
      origin: 'http://localhost',
      href: `http://localhost${pathname}`,
    },
    url: `http://localhost${pathname}`,
    cookies: {
      get: vi.fn((name: string) => {
        if (name === 'jwt' && jwt) return { value: jwt }
        if (cookiesObj && cookiesObj[name]) return { value: cookiesObj[name] }
        return undefined
      }),
      delete: vi.fn(),
    },
  } as any
}

describe('proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows unprotected routes to pass through', async () => {
    const req = mockRequest('/auth/login')
    const res = await proxy(req)
    // Check that response is not a redirect (status 200 or 204)
    expect(res.status).toBeLessThan(300)
  })

  it('redirects to sign-in if JWT is missing on protected route', async () => {
    const req = mockRequest('/dashboard')
    const res = await proxy(req)

    expect(res.headers.get('location')).toBe('http://localhost/auth/login')
  })

  it('allows request to 2fa verify page if JWT is valid and 2FA verified on protected route', async () => {
    ;(jwtVerify as any).mockResolvedValue({
      payload: { sub: 'user123', twoFAEnabled: true },
    })

    // Mock request with cookies including twoFAVerified = 'true'
    const req = mockRequest('/dashboard', 'valid.jwt.token', {
      twoFAVerified: 'true',
    })

    const res = await proxy(req)

    expect(jwtVerify).toHaveBeenCalled()
    expect(res.status).toBeLessThan(300)
  })

  it('redirects and deletes cookie if JWT is invalid', async () => {
    ;(jwtVerify as any).mockRejectedValue(new Error('Invalid token'))

    const req = mockRequest('/profile', 'invalid.jwt.token')
    const res = await proxy(req)

    expect(jwtVerify).toHaveBeenCalled()
    expect(res.headers.get('location')).toBe('http://localhost/auth/login')
  })

  it('passes through non-auth, non-unprotected routes', async () => {
    const req = mockRequest('/public-page')
    const res = await proxy(req)
    expect(res.status).toBeLessThan(300)
  })

  it('redirects to 2FA verify page if 2FA enabled but not verified', async () => {
    ;(jwtVerify as any).mockResolvedValue({
      payload: {
        sub: 'user123',
        twoFAEnabled: true,
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
    })

    const req = mockRequest('/dashboard', 'valid.jwt.token', {
      twoFAVerified: 'false',
    })

    const res = await proxy(req)

    expect(res.headers.get('location')).toBe('http://localhost/2fa/verify')
  })

  it('allows unauthenticated users to access public routes like login', async () => {
    const req = mockRequest('/auth/login', '')
    const res = await proxy(req)

    expect(jwtVerify).not.toHaveBeenCalled()
    expect(res.status).toBeLessThan(300)
  })
})

describe('proxy 2FA redirect tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects authenticated user without 2FA enabled to 2FA setup route when accessing protected route', async () => {
    ;(jwtVerify as any).mockResolvedValue({
      payload: { sub: 'user123', twoFAEnabled: false },
    })

    const req = mockRequest('/dashboard', 'valid.jwt.token')
    const res = await proxy(req)

    expect(res.headers.get('location')).toBe(
      `http://localhost${TWO_FACTOR_SETUP_ROUTE}`,
    )
  })

  it('does not redirect if user with 2FA enabled accesses protected route', async () => {
    ;(jwtVerify as any).mockResolvedValue({
      payload: { sub: 'user123', twoFAEnabled: true },
    })

    const req = mockRequest('/dashboard', 'valid.jwt.token', {
      twoFAVerified: 'true',
    })

    const res = await proxy(req)

    expect(res.status).toBeLessThan(300)
    expect(res.headers.get('location')).toBeNull()
  })

  it('redirects authenticated user without 2FA enabled accessing blocked auth route (like /login) to 2FA setup', async () => {
    ;(jwtVerify as any).mockResolvedValue({
      payload: { sub: 'user123', twoFAEnabled: false },
    })

    //auth/login is blocked for authenticated users
    const req = mockRequest('/auth/login', 'valid.jwt.token')
    const res = await proxy(req)

    expect(res.headers.get('location')).toBe(
      `http://localhost${TWO_FACTOR_SETUP_ROUTE}`,
    )
  })

  it('allows authenticated user without 2FA enabled to access the 2FA setup route', async () => {
    ;(jwtVerify as any).mockResolvedValue({
      payload: { sub: 'user123', twoFAEnabled: false },
    })

    const req = mockRequest(TWO_FACTOR_SETUP_ROUTE, 'valid.jwt.token')
    const res = await proxy(req)

    expect(res.status).toBeLessThan(300)
  })
})
