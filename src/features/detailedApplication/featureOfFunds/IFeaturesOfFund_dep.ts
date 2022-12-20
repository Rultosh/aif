import { IEntity } from "../../../lib/api-wrappers/IEntity";

export interface IFeaturesOfFunds extends IEntity {
  domesticAmount1: string | undefined
}

export const defaultIFeaturesOfFunds : IFeaturesOfFunds = {
  id: undefined,
  parentId: undefined,
  domesticAmount1 : undefined
}