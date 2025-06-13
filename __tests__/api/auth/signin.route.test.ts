import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { POST } from 'src/app/api/auth/sign-in/route'
import { handleApiError } from '@/lib'
import { RequestService } from '@/services'

vi.mock('@/lib', () => ({
  handleApiError: vi.fn(),
  API_URL: 'http://fake-api',
}))

vi.mock('@/services', () => ({
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

  it('calls handleApiError if request.json throws', async () => {
    const error = new Error('Invalid JSON')
    const badRequest = {
      json: vi.fn().mockRejectedValue(error),
    }

    ;(handleApiError as any).mockReturnValue(
      NextResponse.json({ isSuccess: false, message: 'JSON error handled' }),
    )

    const res = await POST(badRequest as any)
    expect(handleApiError).toHaveBeenCalledWith(error)
    const json = await res.json()
    expect(json).toEqual({ isSuccess: false, message: 'JSON error handled' })
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

  it('returns a success response and does NOT set cookie when remember is false', async () => {
    const mockJwt = 'fake-jwt-token'
    const mockUser = { id: 123, email: 'test@example.com' }

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

    expect(res.cookies.get('jwt')).toBeUndefined()
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

  it('calls handleApiError if RequestService throws', async () => {
    const error = new Error('API error')

    ;(RequestService.axiosPost as any).mockRejectedValue(error)
    ;(handleApiError as any).mockReturnValue(
      NextResponse.json({ isSuccess: false, message: 'Handled error' }),
    )

    const req = new MockNextRequest({
      username: 'user',
      password: 'pass',
      remember: true,
    })
    const res = await POST(req as any)

    expect(handleApiError).toHaveBeenCalledWith(error)
    const data = await res.json()
    expect(data.message).toBe('Handled error')
  })
})

describe('POST /api/auth/sign-in - remember flag tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sets JWT cookie when remember is true', async () => {
    const mockJwt = 'jwt-token-remember-true'
    const mockUser = { id: 1, email: 'user1@example.com' }

    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: { user: mockUser, jwt: mockJwt },
    })

    const req = new MockNextRequest({
      username: 'user1',
      password: 'pass',
      remember: true,
    })
    const res = await POST(req as any)

    expect(res.cookies.get('jwt')?.value).toBe(mockJwt)
  })

  it('does NOT set JWT cookie when remember is false', async () => {
    const mockJwt = 'jwt-token-remember-false'
    const mockUser = { id: 2, email: 'user2@example.com' }

    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: { user: mockUser, jwt: mockJwt },
    })

    const req = new MockNextRequest({
      username: 'user2',
      password: 'pass',
      remember: false,
    })
    const res = await POST(req as any)

    expect(res.cookies.get('jwt')).toBeUndefined()
  })

  it('does NOT set JWT cookie when remember is undefined', async () => {
    const mockJwt = 'jwt-token-remember-undefined'
    const mockUser = { id: 3, email: 'user3@example.com' }

    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: { user: mockUser, jwt: mockJwt },
    })

    const req = new MockNextRequest({ username: 'user3', password: 'pass' }) // no remember field
    const res = await POST(req as any)

    expect(res.cookies.get('jwt')).toBeUndefined()
  })
})
