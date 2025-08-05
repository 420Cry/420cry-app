import {
  COMPLETE_PROFILE_API,
  SIGN_UP_API,
  SignUpFormSchema,
  validateFormData,
} from '@/lib'
import SignUpError from '@/lib/constants/error/SignUpError'

import { RequestService } from '@/lib/requests/RequestService'
import { IResponse, ISignUp, IUser } from '@/types'

export const SignUpService = {
  signUpAction: async (
    formData: FormData,
    isOAuthSignUp: boolean,
  ): Promise<{ response: IResponse; user?: IUser }> => {
    const formValues = {
      fullName: formData.get('fullName')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      userName: formData.get('userName')?.toString() || '',
      password: formData.get('password')?.toString() || '',
      repeatedPassword: formData.get('repeatedPassword')?.toString() || '',
    }
    const validation = validateFormData(SignUpFormSchema, formValues)
    if (!validation.success) {
      return {
        response: {
          isSuccess: false,
          message: validation.message,
        },
      }
    }
    try {
      const payload = {
        fullname: validation.data.fullName,
        email: validation.data.email,
        username: validation.data.userName,
        password: validation.data.password,
      }

      if (isOAuthSignUp) {
        const response = await RequestService.nativeFetchPost<
          ISignUp,
          { response: IResponse; user?: IUser }
        >(COMPLETE_PROFILE_API, payload)
        return response
        
      }

      const response = await RequestService.nativeFetchPost<
        ISignUp,
        { response: IResponse; user?: IUser }
      >(SIGN_UP_API, payload)
      return response
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'status' in error) {
        return {
          response: {
            isSuccess: false,
            message: SignUpError[error?.status as number],
          },
        }
      }
      return {
        response: {
          isSuccess: false,
          message: 'app.alertTitle.somethingWentWrong',
        },
      }
    }
  },
}
