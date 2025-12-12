import { IResponse } from '@/types'
import { NextResponse } from 'next/server'

export function createSuccessResponse(
  message: string,
  status = 200,
): NextResponse {
  return NextResponse.json(
    {
      isSuccess: true,
      message,
    } satisfies IResponse,
    { status },
  )
}
