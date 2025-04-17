import { IResponse, ISignUp } from '@/src/types'
import {
  createSignUpPayLoad,
  SignupFormSchema,
} from '@/src/lib/validation/SignupFormSchema'
import { z } from 'zod'
import { AxiosError } from 'axios'
import { RequestService } from '../../requests/RequestService'
import { API_URL } from '@/src/constants/routes'

export const SignUpService = {
  signUpAction: async (formData: FormData): Promise<IResponse> => {
    const formValues = {
      fullName: formData.get('fullName')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      userName: formData.get('userName')?.toString() || '',
      password: formData.get('password')?.toString() || '',
      repeatedPassword: formData.get('repeatedPassword')?.toString() || '',
    }

    try {
      SignupFormSchema.parse(formValues)
      const payload = createSignUpPayLoad(formData)
      const url = `${API_URL}/users/signup`
      return await SignUpService._sendRequest(url, payload)
    } catch (error) {
      return SignUpService._handleError(error)
    }
  },

  _sendRequest: async (url: string, body: ISignUp): Promise<IResponse> => {
    try {
      await RequestService.post(url, body, {
        headers: { 'Content-Type': 'application/json' },
      })
      return {
        isSuccess: true,
        message: 'app.alertTitle.signUpSuccessful',
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 409) {
          return {
            isSuccess: false,
            message: 'app.alertTitle.duplicatedUserNameOrEmail',
          }
        }
      }
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },

  _handleError: (error: unknown): IResponse => {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((e) => e.message)
      return {
        isSuccess: false,
        message: errorMessages[0],
      }
    }
    return {
      isSuccess: false,
      message: 'app.alertTitle.somethingWentWrong',
    }
  },
}
