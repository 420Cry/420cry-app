import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { GET } from 'src/app/api/indicator/fear-and-greed-lastest/route'
import { RequestService, createErrorResponse } from '@/lib'

vi.mock('@/lib', () => ({
  API_URL: 'http://fake-api',
  RequestService: {
    axiosGet: vi.fn(),
  },
  createErrorResponse: vi.fn((message: string, status: number) => {
    return NextResponse.json(
      { response: { isSuccess: false, message } },
      { status },
    )
  }),
}))

describe('GET /api/coin-market-cap/fear-and-greed-lastest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 with data when API responds successfully', async () => {
    const fakeData = { value: 42 }
    ;(RequestService.axiosGet as any).mockResolvedValue({
      status: 200,
      data: { fear_and_greed_index: fakeData },
    })

    const res = await GET()
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.isSuccess).toBe(true)
    expect(body.message).toBe('app.messages.success.general')
    expect(body.data).toEqual(fakeData)
  })

  it('returns error response for non-200 status', async () => {
    ;(RequestService.axiosGet as any).mockResolvedValue({
      status: 500,
      data: null,
    })

    const res = await GET()
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.response.isSuccess).toBe(false)
    expect(body.response.message).toBe('app.messages.error.general')
  })

  it('returns error response when request throws with status', async () => {
    ;(RequestService.axiosGet as any).mockRejectedValue({
      response: { status: 502 },
    })

    const res = await GET()
    const body = await res.json()

    expect(res.status).toBe(502)
    expect(body.response.isSuccess).toBe(false)
    expect(body.response.message).toBe('app.messages.error.general')
  })

  it('returns 500 when unknown error is thrown', async () => {
    ;(RequestService.axiosGet as any).mockRejectedValue(new Error('network'))

    const res = await GET()
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.response.isSuccess).toBe(false)
    expect(body.response.message).toBe('app.messages.error.general')
  })
})
