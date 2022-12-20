import { IEntity } from "../../../../lib/api-wrappers/IEntity";

export interface IDetailedApplication2D extends IEntity {
  numberOfDealsEvaluated: string | undefined,
  sourcingBreakUps: string | undefined,
  businessPlanBreakUps: string | undefined,
  conversionRation: string | undefined,
}

export const defaultIDetailedApplication2D : IDetailedApplication2D = {
  id: undefined,
  parentId: undefined,
  numberOfDealsEvaluated: undefined,
  sourcingBreakUps: undefined,
  businessPlanBreakUps: undefined,
  conversionRation: undefined,
}