import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { GET } from 'src/app/api/wallet-explorer/transaction/route'
import { AxiosResponse } from 'axios'

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

describe('GET /api/wallet-explorer/tx', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 if txid is missing', async () => {
    const req = new MockRequest('http://localhost/api/wallet-explorer/tx')
    const res = await GET(req as any)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.isSuccess).toBe(false)
    expect(data.message).toBe('Missing txid query parameter')
  })

  it('returns 200 with transaction data if API call is successful', async () => {
    const mockTxData = {
      hash: '0xabc123',
      amount: 100,
    }

    mockedAxiosGet.mockResolvedValueOnce({
      status: 200,
      data: { transaction_data: mockTxData },
      statusText: 'OK',
      headers: {},
      config: {},
    } as AxiosResponse)

    const req = new MockRequest(
      'http://localhost/api/wallet-explorer/tx?txid=abc123',
    )
    const res = await GET(req as any)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.isSuccess).toBe(true)
    expect(data.message).toBe('app.messages.api.validTransaction')
    expect(data.data).toEqual(mockTxData)
  })

  it('returns error response when API returns non-200 status', async () => {
    mockedAxiosGet.mockResolvedValueOnce({
      status: 404,
      data: null,
      statusText: 'Not Found',
      headers: {},
      config: {},
    } as AxiosResponse)

    const req = new MockRequest(
      'http://localhost/api/wallet-explorer/tx?txid=invalid',
    )
    const res = await GET(req as any)
    const data = await res.json()

    expect(res.status).toBe(404)
    expect(data.isSuccess).toBe(false)
    expect(data.message).toBe('app.messages.error.general')
  })

  it('returns 500 on unexpected error', async () => {
    mockedAxiosGet.mockRejectedValueOnce(new Error('Internal Server Error'))

    const req = new MockRequest(
      'http://localhost/api/wallet-explorer/tx?txid=fail',
    )
    const res = await GET(req as any)
    const data = await res.json()

    expect(res.status).toBe(500)
    expect(data.isSuccess).toBe(false)
    expect(data.message).toBe('app.messages.error.general')
  })

  it('returns custom status if thrown error includes response.status', async () => {
    mockedAxiosGet.mockRejectedValueOnce({
      response: { status: 403 },
    })

    const req = new MockRequest(
      'http://localhost/api/wallet-explorer/tx?txid=unauthorized',
    )
    const res = await GET(req as any)
    const data = await res.json()

    expect(res.status).toBe(403)
    expect(data.isSuccess).toBe(false)
    expect(data.message).toBe('app.messages.error.general')
  })
})
