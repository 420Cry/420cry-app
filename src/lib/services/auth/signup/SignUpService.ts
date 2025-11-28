import {
  SIGN_UP_API,
  SignUpFormSchema,
  validateFormData,
  RequestService,
  COMPLETE_PROFILE_API,
} from '@/lib'
import { IResponse, ISignUp, IUser } from '@/types'

export class SignUpService {
  public async signUpAction(
    formData: FormData,
    isOAuthSignup: boolean,
  ): Promise<IResponse | { response: IResponse; user?: IUser }> {
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
      const payload: ISignUp = {
        fullname: validation.data.fullName,
        email: validation.data.email,
        username: validation.data.userName,
        password: validation.data.password,
      }

      return await RequestService.nativeFetchPost<
        ISignUp,
        IResponse | { response: IResponse; user?: IUser }
      >(isOAuthSignup ? COMPLETE_PROFILE_API : SIGN_UP_API, payload)
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'status' in error) {
        return {
          isSuccess: false,
          message: 'app.messages.error.emailOrUserNameAlreadyExist',
        }
      }

      return {
        isSuccess: false,
        message: 'app.messages.error.general',
      }
    }
  }
}
