import { IEntity } from "../../../../lib/api-wrappers/IEntity";

export interface IFeaturesOfFunds extends IEntity {
  domesticAmount1: string | undefined,
  internationalAmount1: string | undefined,
  totalAmount1: string | undefined,
  domesticAmount2: string | undefined,
  internationalAmount2: string | undefined,
  totalAmount2: string | undefined,
  detailOfFundLife: string | undefined,
  investmentPeriod: string | undefined,
  targetReturnOfTheFund: string | undefined,
  hurdleRate: string | undefined,
  managementFee: string | undefined,
  provisionOfFundSetup: string | undefined,
  fundOnlyPrimaryInvestment: string | undefined,
  detailsOfExistingFund: string | undefined,
}

export const defaultIFeaturesOfFunds : IFeaturesOfFunds = {
  id: undefined,
  parentId: undefined,
  domesticAmount1 : undefined,
  internationalAmount1 : undefined,
  totalAmount1: undefined,
  domesticAmount2:undefined,
  internationalAmount2: undefined,
  totalAmount2: undefined,
  detailOfFundLife: undefined,
  investmentPeriod: undefined,
  targetReturnOfTheFund: undefined,
  hurdleRate: undefined,
  managementFee: undefined,
  provisionOfFundSetup: undefined,
  fundOnlyPrimaryInvestment: undefined,
  detailsOfExistingFund: undefined,
}