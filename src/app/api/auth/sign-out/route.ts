'use server-only'

import { IResponse } from '@/types'
import { NextResponse } from 'next/server'

export async function POST(): Promise<NextResponse> {
    const response =  NextResponse.json({
      isSuccess: true,
      message: 'app.alertTitle.logOutSuccessful',
    } satisfies IResponse)

  // Clear the 'jwt' cookie by setting it to empty and expiring it immediately
  response.cookies.set('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    maxAge: 0, // expire immediately
  })

  return response
}
