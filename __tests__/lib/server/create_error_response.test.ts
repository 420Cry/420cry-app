import { describe, it, expect } from 'vitest'
import { createErrorResponse } from '@/lib'

describe('createErrorResponse', () => {
  it('returns a NextResponse with the correct structure and status', async () => {
    const message = 'Test error message'
    const status = 400

    const res = createErrorResponse(message, status)

    // Check status
    expect(res.status).toBe(400)

    // Check JSON payload
    const data = await res.json()

    expect(data).toEqual({
      response: {
        isSuccess: false,
        message,
      },
    })
  })

  it('handles different status codes correctly', async () => {
    const res500 = createErrorResponse('Internal server error', 500)
    expect(res500.status).toBe(500)
    const data = await res500.json()
    expect(data.response.message).toBe('Internal server error')
    expect(data.response.isSuccess).toBe(false)
  })
})
