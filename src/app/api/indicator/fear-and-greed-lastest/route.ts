import { API_URL, createErrorResponse, RequestService } from '@/lib'
import { IFearAndGreedIndexData, IResponse } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const response = await RequestService.axiosGet<
      null,
      { fear_and_greed_index: IFearAndGreedIndexData }
    >(`${API_URL}/coin-market-cap/fear-and-greed-lastest`, null, {
      withAuth: true,
    })

    if (response.status === 200 && response.data) {
      return NextResponse.json({
        isSuccess: true,
        message: 'app.alertTitle.Successful',
        data: response.data.fear_and_greed_index,
      } satisfies IResponse & { data: IFearAndGreedIndexData })
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
