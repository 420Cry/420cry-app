import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock `next/headers`
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

import { getJWT } from '@/lib'
import { cookies } from 'next/headers'

describe('getJWT', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the JWT token string when jwt cookie exists', async () => {
    // Mock cookieStore with a jwt cookie
    const mockGet = vi.fn().mockReturnValue({ value: 'mock-jwt-token' })
    ;(cookies as any).mockReturnValue({ get: mockGet })

    const token = await getJWT()

    expect(token).toBe('mock-jwt-token')
    expect(mockGet).toHaveBeenCalledWith('jwt')
  })

  it('throws error if jwt cookie is not found', async () => {
    // Mock cookieStore with no jwt cookie
    const mockGet = vi.fn().mockReturnValue(undefined)
    ;(cookies as any).mockReturnValue({ get: mockGet })

    await expect(getJWT()).rejects.toThrowError(
      'Unauthorized: JWT token not found in cookies',
    )
  })
})
