import { IEntity } from "../../../../lib/api-wrappers/IEntity";

export interface IDetailedApplication2G extends IEntity {
  shareHoldingPattern: string | undefined,
  subsidiaryOfAnotherCompany: string | undefined,
  orgStructure: string | undefined,
  cvs: string | undefined,
  investmentExperience: string | undefined,
  otherVCFsManaged: string | undefined,
}

export const defaultIDetailedApplication2G : IDetailedApplication2G = {
  id: undefined,
  parentId: undefined,
  shareHoldingPattern: undefined,
  subsidiaryOfAnotherCompany: undefined,
  orgStructure: undefined,
  cvs: undefined,
  investmentExperience: undefined,
  otherVCFsManaged: undefined,
}