import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { POST } from '@/app/api/2fa/setup/route'
import { RequestService } from '@/lib'

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
}))

class MockNextRequest {
  constructor(private body: any) {}
  async json() {
    return this.body
  }
}

describe('POST /api/2fa/setup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 and expected data on success', async () => {
    const mockResponse = {
      status: 200,
      data: {
        secret: '123456',
        qrCode: 'data:image/png;base64,...',
      },
    }

    ;(RequestService.axiosPost as any).mockResolvedValue(mockResponse)

    const req = new MockNextRequest({ uuid: 'user-uuid' })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.secret).toBe('123456')
    expect(body.qrCode).toBe('data:image/png;base64,...')
  })

  it('returns error response when status is not 200', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({
      status: 403,
      data: null,
    })

    const req = new MockNextRequest({ uuid: 'user-uuid' })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(403)
    expect(body.response.isSuccess).toBe(false)
    expect(body.response.message).toBe('app.alertTitle.somethingWentWrong')
  })

  it('returns 500 when an error is thrown', async () => {
    ;(RequestService.axiosPost as any).mockRejectedValue(
      new Error('Network Error'),
    )

    const req = new MockNextRequest({ uuid: 'user-uuid' })
    const res = await POST(req as any)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.response.isSuccess).toBe(false)
    expect(body.response.message).toBe('app.alertTitle.somethingWentWrong')
  })
})
