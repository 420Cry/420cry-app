import {
  UPDATE_USER_ACCOUNT_NAME_API,
  RequestService,
  ApiError,
  usernameSchema,
} from '@/lib'
import { IResponse } from '@/types'

interface UpdateUsernamePayload {
  username: string
}

export class UpdateUserAccountNameService {
  public async updateUsername(
    payload: UpdateUsernamePayload,
  ): Promise<IResponse> {
    // Validate username
    const validation = usernameSchema.safeParse(payload.username)
    if (!validation.success) {
      return {
        isSuccess: false,
        message:
          validation.error.issues[0]?.message ||
          'app.messages.error.validationFailed',
      }
    }

    try {
      const result = await RequestService.nativeFetchPost<
        UpdateUsernamePayload,
        IResponse
      >(UPDATE_USER_ACCOUNT_NAME_API, {
        username: validation.data,
      })

      return result
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const status = error.status
        const message =
          status === 401
            ? 'app.messages.error.invalidOTP'
            : status === 409
              ? 'app.messages.error.emailOrUserNameAlreadyExist'
              : 'settings.profile.errorUpdateUsername'

        return {
          isSuccess: false,
          message,
        }
      }

      return {
        isSuccess: false,
        message: 'settings.profile.errorUpdateUsername',
      }
    }
  }
}
