import { IUserBase } from "../user/IUserBase";

export interface IUser extends IUserBase {
  id: number;
  uuid: string;
}
