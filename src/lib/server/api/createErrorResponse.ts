import { IResponse } from '@/types'
import { NextResponse } from 'next/server'

export function createErrorResponse(
  message: string,
  status: number,
): NextResponse {
  return NextResponse.json(
    {
      response: {
        isSuccess: false,
        message,
      } as IResponse,
    },
    { status },
  )
}
