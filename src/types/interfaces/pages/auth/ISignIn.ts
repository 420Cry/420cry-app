export interface ISignIn {
  username: string;
  password: string;
  remember: boolean;
  [key: string]: string | boolean;
}
