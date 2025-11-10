import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { POST } from 'src/app/api/settings/update-user-account-name/route'
import { RequestService, ApiErrorHandler } from '@/lib'

vi.mock('@/lib', () => ({
  API_URL: 'http://fake-api',
  RequestService: {
    axiosPut: vi.fn(),
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

describe('POST /api/settings/update-user-account-name', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 with success message when username is updated successfully', async () => {
    ;(RequestService.axiosPut as any).mockResolvedValue({
      status: 200,
      data: { success: true },
    })

    const req = new MockNextRequest({
      username: 'newusername',
    })
    const res = await POST(req as any)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.isSuccess).toBe(true)
    expect(data.message).toBe('settings.profile.usernameUpdated')
  })

  it('returns 201 with success message when backend returns 201', async () => {
    ;(RequestService.axiosPut as any).mockResolvedValue({
      status: 201,
      data: { success: true },
    })

    const req = new MockNextRequest({
      username: 'newusername',
    })
    const res = await POST(req as any)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.isSuccess).toBe(true)
    expect(data.message).toBe('settings.profile.usernameUpdated')
  })

  it('transforms frontend payload to backend format correctly', async () => {
    ;(RequestService.axiosPut as any).mockResolvedValue({
      status: 200,
      data: { success: true },
    })

    const req = new MockNextRequest({
      username: 'testuser',
    })
    await POST(req as any)

    expect(RequestService.axiosPut).toHaveBeenCalledWith(
      'http://fake-api/api/v1/users/update-account-name',
      {
        username: 'testuser',
      },
      {
        withAuth: true,
      },
    )
  })

  it('returns 409 with conflict message when username already exists', async () => {
    ;(RequestService.axiosPut as any).mockResolvedValue({
      status: 409,
      data: null,
    })

    const req = new MockNextRequest({
      username: 'existinguser',
    })
    const res = await POST(req as any)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.isSuccess).toBe(false)
    expect(data.message).toBe('app.messages.error.emailOrUserNameAlreadyExist')
  })

  it('returns default error message for other status codes', async () => {
    ;(RequestService.axiosPut as any).mockResolvedValue({
      status: 500,
      data: null,
    })

    const req = new MockNextRequest({
      username: 'testuser',
    })
    const res = await POST(req as any)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.isSuccess).toBe(false)
    expect(data.message).toBe('settings.profile.errorUpdateUsername')
  })

  it('uses ApiErrorHandler for error handling', async () => {
    const error = new Error('Network error')
    ;(RequestService.axiosPut as any).mockRejectedValue(error)
    ;(ApiErrorHandler.handle as any).mockReturnValue(
      NextResponse.json({ error: 'handled' }, { status: 500 }),
    )

    const req = new MockNextRequest({
      username: 'testuser',
    })
    const res = await POST(req as any)

    expect(ApiErrorHandler.handle).toHaveBeenCalledWith(error, {
      operation: 'update-username',
      resource: 'user',
    })
    expect(res.status).toBe(500)
  })

  it('sends PUT request with authentication header', async () => {
    ;(RequestService.axiosPut as any).mockResolvedValue({
      status: 200,
      data: { success: true },
    })

    const req = new MockNextRequest({
      username: 'newusername',
    })
    await POST(req as any)

    expect(RequestService.axiosPut).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      expect.objectContaining({
        withAuth: true,
      }),
    )
  })
})
