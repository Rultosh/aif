import { IEntity } from "../../../lib/api-wrappers/IEntity"

export interface IDetailedApplication extends IEntity {
  sidbiRefeferenceNumber : string | undefined,
  investmentThemeOfFund : string | undefined,
  imRoleAndEngagement : string | undefined,
  declarationAccepted : boolean | undefined,
  disputes : string | undefined,
}

export const defaultIDetailedApplication : IDetailedApplication = {
  id : undefined,
  parentId: undefined,
  sidbiRefeferenceNumber : undefined,
  investmentThemeOfFund : undefined,
  imRoleAndEngagement : undefined,
  declarationAccepted : undefined,
  disputes : undefined
}

export const listDefaultIDetailedApplication: IDetailedApplication[] =[];