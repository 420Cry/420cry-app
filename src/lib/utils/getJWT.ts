'use server'

import { cookies } from 'next/headers'

export async function getJWT(): Promise<string> {
  const cookieStore = cookies()
  const token = (await cookieStore).get('jwt')?.value

  if (!token) {
    throw new Error('Unauthorized: JWT token not found in cookies')
  }

  return token
}
