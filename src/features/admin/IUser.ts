import { IEntity } from "../../lib/api-wrappers/IEntity"

export interface IUser extends IEntity {

  username: string | undefined,
  companyName: string | undefined,
  contactPerson: string | undefined,
  title: string | undefined,
  phoneNumber: string | undefined,
  address: string | undefined,
  city: string | undefined,
  state: string | undefined,
  role: undefined,
}

export const defaultIUser : IUser = {
  id : undefined,
  parentId: undefined,
  role: undefined,
  username: undefined,
  companyName: undefined,
  contactPerson: undefined,
  phoneNumber: undefined,
  state: undefined,
  title: undefined,
  city: undefined,
  address: undefined
}

export interface IUserApprove {
    username: string | undefined,
    role: string | undefined
}
