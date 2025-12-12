import { UPDATE_USER_ACCOUNT_NAME_API, ApiError, usernameSchema } from '@/lib'
import { IResponse } from '@/types'
import type { IRequestService } from '@/lib/container/ServiceContainer'

interface UpdateUsernamePayload {
  username: string
}

export class UpdateUserAccountNameService {
  public constructor(private requestService: IRequestService) {}

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
      const result = await this.requestService.nativeFetchPost<
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
