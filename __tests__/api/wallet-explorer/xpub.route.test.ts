import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from 'src/app/api/wallet-explorer/xpub/route'
import { NextResponse } from 'next/server'
import type { AxiosResponse } from 'axios'

vi.mock('@/lib', () => ({
  API_URL: 'http://fake-api',
  RequestService: {
    axiosGet: vi.fn(),
  },
  createErrorResponse: (message: string, status: number) =>
    NextResponse.json(
      {
        isSuccess: false,
        message,
      },
      { status },
    ),
}))

const mockedAxiosGet = vi.mocked(
  (await import('@/lib')).RequestService.axiosGet,
  true,
)

class MockRequest {
  url: string
  constructor(url: string) {
    this.url = url
  }
}

describe('GET /api/wallet-explorer/xpub', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 if xpub is missing', async () => {
    const req = new MockRequest('http://localhost/api/wallet-explorer/xpub')
    const res = await GET(req as any)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.isSuccess).toBe(false)
    expect(data.message).toBe('Missing xpub query parameter')
  })

  it('returns 200 with transaction data when found is true', async () => {
    const mockXpubData = {
      xpub: 'xpub123',
      found: true,
      transactions: [],
    }

    const mockResponse: AxiosResponse = {
      status: 200,
      data: { xpub: mockXpubData },
      statusText: 'OK',
      headers: {},
      config: {
        headers: new (await import('axios')).AxiosHeaders(),
        method: 'get',
        url: 'http://fake-api/wallet-explorer/xpub',
      },
    }

    mockedAxiosGet.mockResolvedValueOnce(mockResponse)

    const req = new MockRequest(
      'http://localhost/api/wallet-explorer/xpub?xpub=xpub123',
    )
    const res = await GET(req as any)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.isSuccess).toBe(true)
    expect(data.message).toBe('app.messages.api.validWallet')
    expect(data.data).toEqual(mockXpubData)
  })

  it('returns error when found is false or data is missing', async () => {
    const mockXpubData = {
      xpub: 'xpub123',
      found: false,
    }

    const mockResponse: AxiosResponse = {
      status: 200,
      data: { xpub: mockXpubData },
      statusText: 'OK',
      headers: {},
      config: {
        headers: new (await import('axios')).AxiosHeaders(),
        method: 'get',
        url: 'http://fake-api/wallet-explorer/xpub',
      },
    }

    mockedAxiosGet.mockResolvedValueOnce(mockResponse)

    const req = new MockRequest(
      'http://localhost/api/wallet-explorer/xpub?xpub=xpub123',
    )
    const res = await GET(req as any)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.isSuccess).toBe(false)
    expect(data.message).toBe('app.messages.error.general')
  })

  it('returns API error status when axios returns non-200', async () => {
    const { AxiosHeaders } = await import('axios')

    const mockResponse: AxiosResponse = {
      status: 404,
      data: { xpub: null },
      statusText: 'Not Found',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
        method: 'get',
        url: 'http://fake-api/wallet-explorer/xpub',
      },
    }

    mockedAxiosGet.mockResolvedValueOnce(mockResponse)

    const req = new MockRequest(
      'http://localhost/api/wallet-explorer/xpub?xpub=invalid',
    )
    const res = await GET(req as any)
    const data = await res.json()

    expect(res.status).toBe(404)
    expect(data.isSuccess).toBe(false)
    expect(data.message).toBe('app.messages.error.general')
  })

  it('returns 500 on unexpected error', async () => {
    mockedAxiosGet.mockRejectedValueOnce(new Error('Unexpected failure'))

    const req = new MockRequest(
      'http://localhost/api/wallet-explorer/xpub?xpub=fail',
    )
    const res = await GET(req as any)
    const data = await res.json()

    expect(res.status).toBe(500)
    expect(data.isSuccess).toBe(false)
    expect(data.message).toBe('app.messages.error.general')
  })

  it('returns error with custom status when axios throws with response.status', async () => {
    mockedAxiosGet.mockRejectedValueOnce({
      response: {
        status: 403,
      },
    })

    const req = new MockRequest(
      'http://localhost/api/wallet-explorer/xpub?xpub=forbidden',
    )
    const res = await GET(req as any)
    const data = await res.json()

    expect(res.status).toBe(403)
    expect(data.isSuccess).toBe(false)
    expect(data.message).toBe('app.messages.error.general')
  })
})
