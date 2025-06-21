import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { POST } from 'src/app/api/auth/sign-up/route'
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

describe('POST route handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns success JSON when status is 200', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 200 })

    const req = new MockNextRequest({ some: 'data' })
    const res = await POST(req as any)

    const json = await res.json()
    expect(json).toEqual({
      isSuccess: true,
      message: 'app.alertTitle.Successful',
    })
  })

  it('returns success JSON when status is 201', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 201 })

    const req = new MockNextRequest({ some: 'data' })
    const res = await POST(req as any)

    const json = await res.json()
    expect(json).toEqual({
      isSuccess: true,
      message: 'app.alertTitle.Successful',
    })
  })

  it('returns failure JSON when status is not 200 or 201', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 400 })

    const req = new MockNextRequest({ some: 'data' })
    const res = await POST(req as any)

    const json = await res.json()
    expect(json).toEqual({
      isSuccess: false,
      message: 'app.alertTitle.somethingWentWrong',
    })
  })

  it('calls handleApiError and returns its response on error', async () => {
    const error = new Error('some error')
    ;(RequestService.axiosPost as any).mockRejectedValue(error)
    ;(handleApiError as any).mockReturnValue(
      NextResponse.json({ isSuccess: false, message: 'error handled' }),
    )

    const req = new MockNextRequest({ some: 'data' })
    const res = await POST(req as any)

    expect(handleApiError).toHaveBeenCalledWith(error)

    const json = await res.json()
    expect(json).toEqual({ isSuccess: false, message: 'error handled' })
  })

  it('sends the correct body to RequestService.axiosPost', async () => {
    const mockBody = { email: 'test@example.com', password: '123456' }
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 200 })

    const req = new MockNextRequest(mockBody)
    await POST(req as any)

    expect(RequestService.axiosPost).toHaveBeenCalledWith(
      'http://fake-api/users/signup',
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
      message: 'app.alertTitle.somethingWentWrong',
    })
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
  it('returns a NextResponse instance', async () => {
    ;(RequestService.axiosPost as any).mockResolvedValue({ status: 200 })

    const req = new MockNextRequest({ some: 'data' })
    const res = await POST(req as any)

    expect(res).toBeInstanceOf(NextResponse)
  })
})

it('returns failure JSON when status is 400', async () => {
  ;(RequestService.axiosPost as any).mockResolvedValue({ status: 400 })

  const req = new MockNextRequest({ some: 'data' })
  const res = await POST(req as any)

  const json = await res.json()
  expect(json).toEqual({
    isSuccess: false,
    message: 'app.alertTitle.somethingWentWrong',
  })
})

it('returns failure JSON when status is 409 (Conflict)', async () => {
  ;(RequestService.axiosPost as any).mockResolvedValue({ status: 409 })

  const req = new MockNextRequest({ some: 'data' })
  const res = await POST(req as any)

  const json = await res.json()
  expect(json).toEqual({
    isSuccess: false,
    message: 'app.alertTitle.somethingWentWrong',
  })
})
