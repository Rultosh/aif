import { IEntity } from "../../../lib/api-wrappers/IEntity"

export interface IDetailedApplication extends IEntity {
  sidbiReferenceNumber : string | undefined,
  nameOfTheFund : string | undefined,
  investmentThemeOfFund : string | undefined,
  imRoleAndEngagement : string | undefined,
  declarationAccepted : boolean | undefined,
  disputes : string | undefined,
  prelimApplicationId: string | undefined,
  status: string | undefined,
  reviewedByUserId: number | undefined,
  actionDate: Date | undefined
}

export const defaultIDetailedApplication : IDetailedApplication = {
  id : undefined,
  parentId: undefined,
  sidbiReferenceNumber : undefined,
  nameOfTheFund : undefined,
  investmentThemeOfFund : undefined,
  imRoleAndEngagement : undefined,
  declarationAccepted : false,
  disputes : undefined , 
  prelimApplicationId: undefined,
  status: undefined,
  reviewedByUserId: undefined,
  actionDate: undefined,
}

export const listDefaultIDetailedApplication: IDetailedApplication[] =[];