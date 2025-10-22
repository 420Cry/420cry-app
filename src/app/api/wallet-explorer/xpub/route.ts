import { API_URL, createErrorResponse, RequestService } from '@/lib'
import { IResponse, ITransactionXPUB } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const xpub = searchParams.get('xpub')

    if (!xpub) {
      return createErrorResponse('Missing xpub query parameter', 400)
    }

    const response = await RequestService.axiosGet<
      { xpub: string },
      { xpub: ITransactionXPUB }
    >(`${API_URL}/api/v1/wallet-explorer/xpub`, { xpub }, { withAuth: false })

    const transactionData = response.data.xpub

    if (response.status === 200 && transactionData?.found) {
      return NextResponse.json({
        isSuccess: true,
        message: 'app.alertTitle.validWallet',
        data: transactionData,
      } satisfies IResponse & { data: ITransactionXPUB })
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
