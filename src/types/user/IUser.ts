export interface IUser {
  uuid: string
  fullname: string
  email: string
  username: string
  twoFAEnabled?: boolean
  rememberMe?: boolean
}
