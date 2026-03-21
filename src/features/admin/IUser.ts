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
  sebiRegistration: string | undefined,
  sebiRegistrationDate: Date | undefined,
  registeredOn: Date | undefined,
  role: undefined,
  /** When true and server MFA is on, user must complete email OTP at login. */
  otpRequired?: boolean,
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
  address: undefined,
  sebiRegistration: undefined,
  sebiRegistrationDate: undefined,
  registeredOn: undefined,
  otpRequired: false,
}

export interface IUserApprove {
    username: string | undefined,
    role: string | undefined
}
