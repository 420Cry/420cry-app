'use server-only'

import { API_URL, handleApiError } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { RequestService } from '@/services'
import { ISignIn, IUser, IResponse } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()

    const response = await RequestService.axiosPost<ISignIn, IUser>(
      `${API_URL}/users/signin`,
      body,
    )

    if (response.status === 200 && response.data) {
      const user = response.data
      const token = user.jwt ?? null
      console.log('Set token cookie:', token)

      const responseBody = {
        response: {
          isSuccess: true,
          message: 'app.alertTitle.Successful',
        } as IResponse,
        user,
      }

      const nextResponse = NextResponse.json(responseBody)

      if (token) {
        nextResponse.cookies.set('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production' ? true : false,
          path: '/',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        })
        const testTokenIsSet = nextResponse.cookies.get('token')?.value
        console.log(testTokenIsSet)
      }

      return nextResponse
    }

    return NextResponse.json(
      {
        response: {
          isSuccess: false,
          message: 'app.alertTitle.somethingWentWrong',
        } as IResponse,
      },
      { status: 401 },
    )
  } catch (error) {
    console.error('Error in POST /signin:', error)
    return handleApiError(error)
  }
}
