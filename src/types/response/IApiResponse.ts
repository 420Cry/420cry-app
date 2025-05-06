// Generic response type: always has isSuccess + message, optionally data
export interface IApiResponse<T = undefined> {
  isSuccess: boolean
  message: string
  data?: T
}