import { API_URL, createErrorResponse, RequestService } from '@/lib'
import { IFearAndGreedHistoricalData, IResponse } from '@/types'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse> {
  try {
    const response = await RequestService.axiosGet<
      null,
      { fear_and_greed_historical: IFearAndGreedHistoricalData }
    >(`${API_URL}/coin-market-cap/fear-and-greed-historical`, null, {
      withAuth: true,
    })

    if (response.status === 200 && response.data) {
      return NextResponse.json({
        isSuccess: true,
        message: 'app.alertTitle.Successful',
        data: response.data.fear_and_greed_historical,
      } satisfies IResponse & { data: IFearAndGreedHistoricalData })
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
