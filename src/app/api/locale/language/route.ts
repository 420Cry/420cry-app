import { CookieService } from '@/lib'
import { IResponse } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const responseBody: IResponse = {
      isSuccess: true,
      message: 'app.alertTitle.changeLanguageSuccessful',
    }

    const nextResponse = NextResponse.json(responseBody)
    if (body === 'en' || body === 'vi') {
      CookieService.setLocaleCookie(nextResponse, body)
    }

    return nextResponse
  } catch {
    const responseBody: IResponse = {
      isSuccess: false,
      message: 'app.alertTitle.somethingWentWrong',
    }

    return NextResponse.json(responseBody)
  }
}
