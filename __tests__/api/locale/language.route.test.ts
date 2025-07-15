import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from 'src/app/api/locale/language/route'
import { NextResponse } from 'next/server'

vi.mock('@/lib', () => ({
  CookieService: {
    setLocaleCookie: vi.fn(),
  },
}))

const { CookieService } = await import('@/lib')

class MockRequest {
  constructor(private body: any) {}
  async json() {
    return this.body
  }
}

describe('POST /api/change-language', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sets locale cookie to "en" and returns success response', async () => {
    const req = new MockRequest('en')
    const res = await POST(req as any)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.isSuccess).toBe(true)
    expect(data.message).toBe('app.alertTitle.changeLanguageSuccessful')
    expect(CookieService.setLocaleCookie).toHaveBeenCalledWith(
      expect.any(NextResponse),
      'en',
    )
  })

  it('sets locale cookie to "vi" and returns success response', async () => {
    const req = new MockRequest('vi')
    const res = await POST(req as any)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.isSuccess).toBe(true)
    expect(data.message).toBe('app.alertTitle.changeLanguageSuccessful')
    expect(CookieService.setLocaleCookie).toHaveBeenCalledWith(
      expect.any(NextResponse),
      'vi',
    )
  })

  it('does not set cookie for unsupported language but still returns success', async () => {
    const req = new MockRequest('fr')
    const res = await POST(req as any)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.isSuccess).toBe(true)
    expect(data.message).toBe('app.alertTitle.changeLanguageSuccessful')
    expect(CookieService.setLocaleCookie).not.toHaveBeenCalled()
  })

  it('returns error response if request.json throws', async () => {
    const brokenRequest = {
      json: vi.fn().mockRejectedValueOnce(new Error('fail')),
    }

    const res = await POST(brokenRequest as any)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.isSuccess).toBe(false)
    expect(data.message).toBe('app.alertTitle.somethingWentWrong')
    expect(CookieService.setLocaleCookie).not.toHaveBeenCalled()
  })
})
