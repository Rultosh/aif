import { IEntity } from "../../lib/api-wrappers/IEntity"

export interface ISignup extends IEntity {

  username: string | undefined,
  companyName: string | undefined,
  contactPerson: string | undefined,
  title: string | undefined,
  phoneNumber: string | undefined,
  address: string | undefined,
  city: string | undefined,
  otherCity: string | undefined,
  state: string | undefined,
  sebiRegistration: string | undefined,
  sebiRegistrationDate: Date | undefined | null,
  registeredOn: Date | undefined | null
}

export const defaultISignup: ISignup = {
  id: undefined,
  parentId: undefined,
  username: undefined,
  companyName: undefined,
  contactPerson: undefined,
  phoneNumber: undefined,
  state: undefined,
  title: undefined,
  city: undefined,
  otherCity: undefined,
  address: undefined,
  sebiRegistration: undefined,
  sebiRegistrationDate: null,
  registeredOn: null
}
