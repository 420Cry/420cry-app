import { UpdateUserAccountNameService } from './user_account_name/UpdateUserAccountNameService'
import type { IRequestService } from '@/lib/container/ServiceContainer'

export class SettingsService {
  public updateUserAccountName: UpdateUserAccountNameService

  public constructor(requestService: IRequestService) {
    this.updateUserAccountName = new UpdateUserAccountNameService(
      requestService,
    )
  }
}
