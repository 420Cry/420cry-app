import { IResponse } from '@/src/types'

export function createResponse(success: boolean, message: string): IResponse {
  return {
    success,
    message,
  }
}
