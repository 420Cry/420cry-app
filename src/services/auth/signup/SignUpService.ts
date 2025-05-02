import { IResponse, ISignUp } from '@/types'
import { z } from 'zod'
import { AxiosError } from 'axios'
import { RequestService } from '../../requests/RequestService'
import { API_URL } from '@/lib/constants/routes'
import { SignUpFormSchema } from '@/lib'

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
      SignUpFormSchema.parse(formValues)
      const payload = SignUpService._createSignUpPayLoad(formData)
      const signUpUrl = `${API_URL}/users/signup`
      return await SignUpService._sendRequest(signUpUrl, payload)
    } catch (error) {
      return SignUpService._handleError(error)
    }
  },

  _createSignUpPayLoad(formData: FormData): ISignUp {
    return {
      fullname: formData.get('fullName')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      username: formData.get('userName')?.toString() || '',
      password: formData.get('password')?.toString() || '',
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
