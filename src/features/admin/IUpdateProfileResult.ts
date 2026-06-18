import { IUser } from "./IUser";

export interface IUpdateProfileResult {
  user: IUser;
  currentUser?: string;
  refreshToken?: string;
}
