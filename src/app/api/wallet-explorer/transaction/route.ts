import { API_URL, createErrorResponse, RequestService } from '@/lib'
import { IResponse, ITransactionData } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const txid = searchParams.get('txid')

    if (!txid) {
      return createErrorResponse('Missing txid query parameter', 400)
    }

    const response = await RequestService.axiosGet<
      { txid: string },
      { transaction_data: ITransactionData }
    >(`${API_URL}/api/v1/wallet-explorer/tx`, { txid }, { withAuth: true })

    if (response.status === 200 && response.data) {
      return NextResponse.json({
        isSuccess: true,
        message: 'app.alertTitle.validTransaction',
        data: response.data.transaction_data,
      } satisfies IResponse & { data: ITransactionData })
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
