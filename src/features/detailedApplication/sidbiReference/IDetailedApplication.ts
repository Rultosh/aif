import { IEntity } from "../../../lib/api-wrappers/IEntity"

export interface IDetailedApplication extends IEntity {
  sidbiRefeferenceNumber : string | undefined,
  investmentThemeOfFund : string | undefined,
  imRoleAndEngagement : string | undefined,
  declarationAccepted : string | undefined
}

export const defaultIDetailedApplication : IDetailedApplication = {
  id : undefined,
  parentId: undefined,
  sidbiRefeferenceNumber : undefined,
  investmentThemeOfFund : undefined,
  imRoleAndEngagement : undefined,
  declarationAccepted : undefined
}