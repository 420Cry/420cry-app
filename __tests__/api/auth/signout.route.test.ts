import { describe, it, expect } from 'vitest'
import { POST } from 'src/app/api/auth/sign-out/route'

describe('POST /logout', () => {
  it('returns success message and clears jwt cookie', async () => {
    const response = await POST()

    const json = await response.json()
    expect(json).toEqual({
      isSuccess: true,
      message: 'app.alertTitle.logOutSuccessful',
    })

    const cookie = response.cookies.get('jwt')
    expect(cookie).toBeDefined()
    expect(cookie?.value).toBe('')
    expect(cookie?.httpOnly).toBe(true)
    expect(cookie?.path).toBe('/')
    expect(cookie?.sameSite).toBe('lax')
    expect(cookie?.maxAge).toBe(0)

    if (process.env.NODE_ENV === 'production') {
      expect(cookie?.secure).toBe(true)
    } else {
      expect(cookie?.secure).toBe(false)
    }
  })

  it('sets maxAge to 0 to expire cookie immediately', async () => {
    const response = await POST()
    const cookie = response.cookies.get('jwt')
    expect(cookie?.maxAge).toBe(0)
  })

  it('sets httpOnly flag on the cookie', async () => {
    const response = await POST()
    const cookie = response.cookies.get('jwt')
    expect(cookie?.httpOnly).toBe(true)
  })

  it('sets cookie path to root "/"', async () => {
    const response = await POST()
    const cookie = response.cookies.get('jwt')
    expect(cookie?.path).toBe('/')
  })

  it('sets sameSite attribute to "lax"', async () => {
    const response = await POST()
    const cookie = response.cookies.get('jwt')
    expect(cookie?.sameSite).toBe('lax')
  })
})
