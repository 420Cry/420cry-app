import { NextResponse } from 'next/server'

export function handleApiError(error: unknown): NextResponse {
  const err = error as {
    response?: { status?: number; data?: { message?: string } }
  }

  const status = err.response?.status || 500
  const message =
    err.response?.data?.message || 'app.alertTitle.somethingWentWrong'

  return NextResponse.json({ message }, { status })
}
