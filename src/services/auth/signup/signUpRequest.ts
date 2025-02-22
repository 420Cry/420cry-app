import { IResponse, ISignUp } from '@/src/types'
import axios from 'axios'

export async function signUpRequest(
  url: string,
  body: ISignUp,
): Promise<IResponse> {
  try {
    await axios.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
    })
    return {
      success: true,
      message: 'app.alertTitle.signUpSuccessful',
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
