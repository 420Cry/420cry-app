import { NextResponse } from 'next/server'

export function handleApiError(error: unknown): NextResponse {
  const axiosError = error as {
    response?: { status?: number; data?: { message?: string } }
  }

  // fallback default
  let status = 500
  let message = 'app.alertTitle.somethingWentWrong'

  if (axiosError?.response) {
    status = axiosError.response.status || status
    message = axiosError.response.data?.message || message
  } else if (error instanceof Error) {
    message = error.message || message
  }

  return NextResponse.json({ message }, { status })
}
