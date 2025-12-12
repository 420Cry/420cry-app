import { describe, it, expect } from 'vitest'
import { NextResponse } from 'next/server'
import { createSuccessResponse } from '@/lib'

describe('createSuccessResponse', () => {
  it('creates a NextResponse with success message and default status 200', async () => {
    const response = createSuccessResponse('app.messages.success.test')

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(200)

    const json = await response.json()
    expect(json).toEqual({
      isSuccess: true,
      message: 'app.messages.success.test',
    })
  })

  it('creates a NextResponse with custom status code', async () => {
    const response = createSuccessResponse('app.messages.success.test', 201)

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(201)

    const json = await response.json()
    expect(json).toEqual({
      isSuccess: true,
      message: 'app.messages.success.test',
    })
  })

  it('returns response that satisfies IResponse type', async () => {
    const response = createSuccessResponse('test.message')
    const json = await response.json()

    expect(json).toHaveProperty('isSuccess')
    expect(json).toHaveProperty('message')
    expect(json.isSuccess).toBe(true)
    expect(typeof json.message).toBe('string')
  })
})
