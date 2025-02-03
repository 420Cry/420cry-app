import { IUserBase } from "../user/IUserBase";

export interface ISignUp extends IUserBase {
  repeatedPassword: string;
  [key: string]: string;
}
