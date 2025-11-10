import { API_URL, createErrorResponse, RequestService } from '@/lib'
import { IFearAndGreedIndexData, IResponse } from '@/types'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse> {
  try {
    const response = await RequestService.axiosGet<
      null,
      { fear_and_greed_index: IFearAndGreedIndexData }
    >(`${API_URL}/api/v1/coin-market-cap/fear-and-greed-lastest`, null, {
      withAuth: false,
    })

    if (response.status === 200 && response.data) {
      return NextResponse.json({
        isSuccess: true,
        message: 'app.messages.success.general',
        data: response.data.fear_and_greed_index,
      } satisfies IResponse & { data: IFearAndGreedIndexData })
    }

    return createErrorResponse('app.messages.error.general', response.status)
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } }
    const status = err?.response?.status ?? 500
    const message = 'app.messages.error.general'
    return createErrorResponse(message, status)
  }
}
