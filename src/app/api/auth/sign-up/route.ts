'use server-only'

import { API_URL } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'
import { RequestService } from '@/services'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const goResponse = await RequestService.axiosPost(
      `${API_URL}/users/signup`,
      body,
    )
    return NextResponse.json(goResponse.data)
  } catch (error) {
    const err = error as {
      response?: { status?: number; data?: { message?: string } }
    }
    const status = err.response?.status || 500
    const message =
      err.response?.data?.message || 'app.alertTitle.somethingWentWrong'
    return NextResponse.json({ message }, { status })
  }
}
