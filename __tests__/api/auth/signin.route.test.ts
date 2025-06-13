import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { POST } from 'src/app/api/auth/sign-in/route'
import { handleApiError } from '@/lib'

vi.mock('@/lib', () => ({
  handleApiError: vi.fn(),
  API_URL: 'http://fake-api',
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

  // Mock global fetch for each test
  function mockFetch(
    response: Partial<Response> & { json: () => Promise<any> },
  ) {
    return vi.fn(() => Promise.resolve(response))
  }

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
    global.fetch = mockFetch({
      status: 200,
      headers: new Headers(),
      json: async () => ({}),
    }) as any

    const req = new MockNextRequest({ username: 'user3', password: 'pass789' })
    const res = await POST(req as any)

    expect(res).toBeInstanceOf(NextResponse)
  })
})
