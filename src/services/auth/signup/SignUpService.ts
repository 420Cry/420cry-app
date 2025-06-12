import { SIGN_UP_API, SignUpFormSchema, validateFormData } from '@/lib'
import { RequestService } from '@/services'
import { IResponse } from '@/types'

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
      return await RequestService.nativeFetchPost<IResponse>(
        SIGN_UP_API,
        payload,
      )
    } catch {
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
