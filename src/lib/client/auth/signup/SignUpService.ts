import {
  SIGN_UP_API,
  SignUpFormSchema,
  validateFormData,
  RequestService,
} from '@/lib'
import { IResponse, ISignUp } from '@/types'

export const SignUpService = {
  signUpAction: async (formData: FormData): Promise<IResponse> => {
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
        isSuccess: false,
        message: validation.message,
      }
    }
    try {
      const payload = {
        fullname: validation.data.fullName,
        email: validation.data.email,
        username: validation.data.userName,
        password: validation.data.password,
      }
      const response = await RequestService.nativeFetchPost<ISignUp, IResponse>(
        SIGN_UP_API,
        payload,
      )
      return response
    } catch (error: any) {
      if (error.status === 409) {
        return {
          isSuccess: false,
          message: 'app.alertTitle.emailOrUserNameAlreadyExist',
        }
      }
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
