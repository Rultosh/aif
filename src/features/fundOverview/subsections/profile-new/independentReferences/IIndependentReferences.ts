import { IEntity } from "../../../../../lib/api-wrappers/IEntity";

export interface IIndependentReferences extends IEntity {
    nameOfCompany: string | undefined,
    designation: string | undefined,
    organisation: string | undefined,
    telephoneNo: string | undefined,
    mobileNo: string | undefined,
    email: string | undefined,
    alternateEmail: string | undefined,
}

export const defaultIIIndependentReferences = {
  id: undefined,
  parentId : undefined,
  teamMemberId: undefined,
  nameOfCompany: undefined,
  designation: undefined,
  organisation: undefined,
  telephoneNo: undefined,
  mobileNo: undefined,
  email: undefined,
  alternateEmail: undefined
}