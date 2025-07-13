import { API_URL, createErrorResponse, RequestService } from '@/lib'
import { IResponse } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import { getJWT } from '@/lib'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const txid = searchParams.get('txid')

    if (!txid) {
      return createErrorResponse('Missing txid query parameter', 400)
    }

    const jwt = await getJWT()

    const response = await RequestService.axiosGet<{ txid: string }, IResponse>(
      `${API_URL}/wallet-explorer/tx`,
      { txid },
      jwt,
    )

    console.log('Transaction search response:', response)

    if (response.status === 200) {
      return NextResponse.json({
        isSuccess: true,
        message: 'app.alertTitle.validTransaction',
      } satisfies IResponse)
    }

    return createErrorResponse(
      'app.alertTitle.somethingWentWrong',
      response.status,
    )
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } }
    const status = err?.response?.status ?? 500
    const message = 'app.alertTitle.somethingWentWrong'
    return createErrorResponse(message, status)
  }
}
