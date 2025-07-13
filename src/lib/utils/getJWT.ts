'use server'

import { cookies } from 'next/headers'
import { AxiosRequestConfig } from 'axios'

export async function getJWT(): Promise<AxiosRequestConfig> {
  const cookieStore = cookies()
  const token = (await cookieStore).get('jwt')?.value

  if (!token) {
    throw new Error('Unauthorized: JWT token not found in cookies')
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}
