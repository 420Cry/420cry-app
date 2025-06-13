import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { middleware } from '@/middleware'

vi.mock('jose', () => ({
  jwtVerify: vi.fn(),
}))

const SIGN_IN_ROUTE = '/auth/login'
const AUTH_ROUTES = ['/', '/dashboard', '/profile']
const UN_AUTH_ROUTES = [
  SIGN_IN_ROUTE,
  '/auth/signup',
  '/auth/reset-password',
  '/api/auth/logout',
  '/auth/signup/verify',
]

vi.mock('./lib', async () => ({
  AUTH_ROUTES,
  UN_AUTH_ROUTES,
  SIGN_IN_ROUTE,
}))

function mockRequest(pathname: string, jwt?: string) {
  return {
    nextUrl: {
      pathname,
      origin: 'http://localhost',
      href: `http://localhost${pathname}`,
    },
    url: `http://localhost${pathname}`,
    cookies: {
      get: vi.fn((name: string) =>
        name === 'jwt' && jwt ? { value: jwt } : undefined,
      ),
      delete: vi.fn(),
    },
  } as any
}

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows unprotected routes to pass through', async () => {
    const req = mockRequest('/auth/login')
    const res = await middleware(req)
    expect(res).toEqual(NextResponse.next())
  })

  it('redirects to sign-in if JWT is missing on protected route', async () => {
    const req = mockRequest('/dashboard')
    const res = await middleware(req)

    expect(res.headers.get('location')).toBe('http://localhost/auth/login')
  })

  it('allows request if JWT is valid on protected route', async () => {
    ;(jwtVerify as any).mockResolvedValue({ payload: { sub: 'user123' } })

    const req = mockRequest('/dashboard', 'valid.jwt.token')
    const res = await middleware(req)

    expect(jwtVerify).toHaveBeenCalled()
    expect(res).toEqual(NextResponse.next())
  })

  it('redirects and deletes cookie if JWT is invalid', async () => {
    ;(jwtVerify as any).mockRejectedValue(new Error('Invalid token'))

    const req = mockRequest('/profile', 'invalid.jwt.token')
    const res = await middleware(req)

    expect(jwtVerify).toHaveBeenCalled()
    expect(res.headers.get('location')).toBe('http://localhost/auth/login')
  })

  it('passes through non-auth, non-unprotected routes', async () => {
    const req = mockRequest('/public-page')
    const res = await middleware(req)
    expect(res).toEqual(NextResponse.next())
  })

  it('matches exact protected route and sub-paths', async () => {
    ;(jwtVerify as any).mockResolvedValue({ payload: { sub: 'user123' } })

    const req = mockRequest('/dashboard/settings', 'valid.jwt.token')
    const res = await middleware(req)

    expect(res).toEqual(NextResponse.next())
  })
})
