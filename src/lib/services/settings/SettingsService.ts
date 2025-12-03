import { UpdateUserAccountNameService } from './user_account_name/UpdateUserAccountNameService'

export class SettingsService {
  public updateUserAccountName: UpdateUserAccountNameService

  public constructor() {
    this.updateUserAccountName = new UpdateUserAccountNameService()
  }
}

// singleton instance
export const settingsService = new SettingsService()
