import { IResponse, ISignUp } from '@/types'
import { RequestService, ErrorHandlerService } from '@/services'
import { SignUpFormSchema, API_URL } from '@/lib'
import { z } from 'zod'

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
      return await ErrorHandlerService.safeRequest(
        () => RequestService.post(signUpUrl, payload),
        {
          409: 'app.alertTitle.duplicatedUserNameOrEmail',
        },
        'app.alertTitle.signUpSuccessful',
      )
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
