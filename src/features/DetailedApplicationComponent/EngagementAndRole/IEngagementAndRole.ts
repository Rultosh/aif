import { IEntity } from "../../../lib/api-wrappers/IEntity";

export interface IEngagementAndRole extends IEntity {
  detailedApplication: string | undefined,
  investmentTheme: string | undefined,
  detailedEngagement: string | undefined,
  carryDistribution: string | undefined,
}

export const defaultIEngagementAndRole : IEngagementAndRole = {
  id: undefined,
  parentId: undefined,
  detailedApplication: undefined,
  investmentTheme: undefined,
  detailedEngagement: undefined,
  carryDistribution: undefined,
}