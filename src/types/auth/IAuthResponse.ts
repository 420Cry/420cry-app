import { IUser } from '../user/IUser'

export interface IAuthResponse {
  jwt: string
  user: IUser
}
