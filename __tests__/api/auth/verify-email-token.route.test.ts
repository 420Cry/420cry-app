import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { POST } from 'src/app/api/auth/verify-email-token/route'
import { RequestService } from '@/lib'

vi.mock('@/lib', () => ({
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

describe('POST /api/auth/verify-email-token', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns success JSON when status is 200', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 200 })

    const req = new MockNextRequest({ token: 'abc123' })
    const res = await POST(req as any)

    const json = await res.json()
    expect(json).toEqual({
      isSuccess: true,
      message: 'app.messages.success.general',
    })
  })

  it('returns failure JSON when status is not 200', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 403 })

    const req = new MockNextRequest({ token: 'bad-token' })
    const res = await POST(req as any)

    const json = await res.json()
    expect(json).toEqual({
      isSuccess: false,
      message: 'app.messages.error.general',
    })
  })

  it('sends the correct body to RequestService.axiosPost', async () => {
    const mockBody = { token: 'verify-email-token' }
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 200 })

    const req = new MockNextRequest(mockBody)
    await POST(req as any)

    expect(RequestService.axiosPost).toHaveBeenCalledWith(
      'http://fake-api/api/v1/users/verify-email-token',
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
      message: 'app.messages.error.general',
    })
  })

  it('returns a NextResponse instance', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 200 })

    const req = new MockNextRequest({ token: 'abc' })
    const res = await POST(req as any)

    expect(res).toBeInstanceOf(NextResponse)
  })
})
