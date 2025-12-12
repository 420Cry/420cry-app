import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { POST } from 'src/app/api/2fa/alternative/send-email-otp/route'
import { RequestService } from '@/lib'

vi.mock('@/lib', () => ({
  API_URL: 'http://fake-api',
  RequestService: {
    axiosPost: vi.fn(),
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

describe('POST /api/2fa/alternative/send-email-otp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 when request succeeds', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 200,
      data: {},
    })

    const req = new MockNextRequest({ email: 'user@example.com' })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.isSuccess).toBe(true)
    expect(body.message).toBe('app.messages.success.general')
  })

  it('returns error response for non-200 status', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 500,
      data: {},
    })

    const req = new MockNextRequest({ email: 'user@example.com' })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(200) // handler still returns 200 with isSuccess: false
    expect(body.isSuccess).toBe(false)
    expect(body.message).toBe('app.messages.error.general')
  })

  it('returns 500 when axiosPost throws unknown error', async () => {
    ;(RequestService.axiosPost as any).mockRejectedValue(
      new Error('network error'),
    )

    const req = new MockNextRequest({ email: 'user@example.com' })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.response.isSuccess).toBe(false)
    expect(body.response.message).toBe('app.messages.error.general')
  })
})
