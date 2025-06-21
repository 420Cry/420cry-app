import {
  SIGN_IN_API,
  SignInFormSchema,
  validateFormData,
  RequestService,
  ApiError,
} from '@/lib'
import { IUser, ISignIn, IResponse } from '@/types'

export const SignInService = {
  async signInAction(
    formData: FormData,
  ): Promise<{ response: IResponse; user?: IUser }> {
    const formValues = {
      userName: formData.get('userName')?.toString() || '',
      password: formData.get('password')?.toString() || '',
      rememberMe: formData.has('rememberMe'),
    }

    const validation = validateFormData(SignInFormSchema, formValues)
    if (!validation.success) {
      return {
        response: {
          isSuccess: false,
          message: validation.message,
        },
      }
    }

    try {
      const payload: ISignIn = {
        username: validation.data.userName,
        password: validation.data.password,
        remember: validation.data.rememberMe ?? false,
      }
      const response = await RequestService.nativeFetchPost<
        ISignIn,
        { response: IResponse; user?: IUser }
      >(SIGN_IN_API, payload)
      return response
    } catch (error: any) {
      if (error instanceof ApiError) {
        const status = error.status
        const message =
          status === 401
            ? 'app.alertTitle.invalidCredentials'
            : status === 403
              ? 'app.alertTitle.userNotVerified'
              : 'app.alertTitle.somethingWentWrong'

        return {
          response: {
            isSuccess: false,
            message,
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
