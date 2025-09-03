'use server-only'

import { getOAuthApi } from '@/lib/utils/getOAuthApi'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse> {
  const GOOGLE_AUTH_API = getOAuthApi()

  return NextResponse.redirect(GOOGLE_AUTH_API)
}
