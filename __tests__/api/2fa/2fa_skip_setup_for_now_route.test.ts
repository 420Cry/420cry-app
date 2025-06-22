import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/2fa/setup/skip-setup-for-now/route'
import { NextResponse } from 'next/server'
import { CookieService } from '@/lib'

vi.mock('@/lib', () => ({
  CookieService: {
    setTwoFASetUpSkippedCookie: vi.fn(),
  },
}))

describe('POST /api/auth/2fa/skip-setup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 response with skip message', async () => {
    const res = await POST()
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json).toEqual({
      isSuccess: true,
      message: '2fa.setup.skipForNow',
    })
  })

  it('calls setTwoFASetUpSkippedCookie with the response', async () => {
    const res = await POST()

    expect(CookieService.setTwoFASetUpSkippedCookie).toHaveBeenCalledTimes(1)
    expect(CookieService.setTwoFASetUpSkippedCookie).toHaveBeenCalledWith(
      expect.any(NextResponse),
    )
  })
})
