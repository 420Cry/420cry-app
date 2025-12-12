import {
  SIGN_IN_API,
  SignInFormSchema,
  validateFormData,
  ApiError,
} from '@/lib'
import { IUser, ISignIn, IResponse } from '@/types'
import type { IRequestService } from '@/lib/container/ServiceContainer'

export class SignInService {
  public constructor(private requestService: IRequestService) {}

  public async signInAction(
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
      const response = await this.requestService.nativeFetchPost<
        ISignIn,
        { response: IResponse; user?: IUser }
      >(SIGN_IN_API, payload)
      return response
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const status = error.status
        const message =
          status === 401
            ? 'app.messages.error.invalidCredentials'
            : status === 403
              ? 'app.messages.error.userNotVerified'
              : 'app.messages.error.general'

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
          message: 'app.messages.error.general',
        },
      }
    }
  }
}
