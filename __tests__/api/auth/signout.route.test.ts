import { describe, it, expect } from 'vitest'
import { POST } from 'src/app/api/auth/sign-out/route'
describe('POST /logout', () => {
  it('returns success message and clears jwt cookie', async () => {
    const response = await POST()

    // Check JSON response body
    const json = await response.json()
    expect(json).toEqual({ message: 'Logged out successfully' })

    // Check cookie is cleared correctly
    const cookie = response.cookies.get('jwt')
    expect(cookie).toBeDefined()
    expect(cookie?.value).toBe('')
    expect(cookie?.httpOnly).toBe(true)
    expect(cookie?.path).toBe('/')
    expect(cookie?.sameSite).toBe('lax')
    expect(cookie?.maxAge).toBe(0)

    // Secure flag depends on NODE_ENV
    if (process.env.NODE_ENV === 'production') {
      expect(cookie?.secure).toBe(true)
    } else {
      expect(cookie?.secure).toBe(false)
    }
  })
})
