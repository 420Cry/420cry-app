export interface ISignUp {
  fullname: string;
  email: string;
  username: string;
  password: string;
  repeatedPassword: string;
  [key: string]: string;
}
