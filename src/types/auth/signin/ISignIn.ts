export interface ISignIn {
  username: string
  password: string
  remember: boolean | undefined // undefined because remember me func is not implemented
}
