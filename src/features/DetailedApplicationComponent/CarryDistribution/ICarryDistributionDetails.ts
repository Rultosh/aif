import { IEntity } from "../../../lib/api-wrappers/IEntity";

export interface ICarryDistributionDetails extends IEntity {
  distribution: string | undefined,
  percent: string | undefined,
  carryOutOfCrore: string | undefined,
  
}

export const defaultICarryDistributionDetails : ICarryDistributionDetails = {
  id: undefined,
  parentId: undefined,
  distribution: undefined,
  percent: undefined,
  carryOutOfCrore: undefined,
}