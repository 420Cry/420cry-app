import { ISignUpResponse } from '@/src/types'

export function createSignUpResponse(
  success: boolean,
  message: string,
  token?: string,
): ISignUpResponse {
  const response: ISignUpResponse = {
    success,
    message,
  }
  if (token) {
    response.token = token
  }

  return response
}
