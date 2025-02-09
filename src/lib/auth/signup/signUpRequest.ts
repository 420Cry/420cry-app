import { ISignUp, ISignUpResponse } from '@/src/types'
import axios, { AxiosResponse } from 'axios'

export async function signUpRequest<T>(
  url: string,
  body: ISignUp,
): Promise<ISignUpResponse> {
  try {
    const response: AxiosResponse<T> = await axios.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
    })
    const token = (response.data as { token: string }).token
    return {
      success: true,
      message: 'app.alertTitle.signUpSuccessful',
      token: token,
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        return {
          success: false,
          message: 'app.alertTitle.duplicatedUserNameOrEmail',
        }
      }
      return {
        success: false,
        message: error.message || 'app.alertTitle.somethingWentWrong',
      }
    } else {
      return {
        success: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  }
}
