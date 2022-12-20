import { IEntity } from "../../../../lib/api-wrappers/IEntity";

export interface IDetailedApplication2B extends IEntity {
  fundLaunchedDate: string | undefined,
  commitmentReceived: string | undefined,
  firstClosing: string | undefined,
  dateOfFinalClosing: string | undefined,
  contribTerms: string | undefined,
  investmentManagerPlacementAgent: string | undefined,
}

export const defaultIDetailedApplication2B : IDetailedApplication2B = {
  id: undefined,
  parentId: undefined,
  fundLaunchedDate: undefined,
  commitmentReceived: undefined,
  firstClosing: undefined,
  dateOfFinalClosing: undefined,
  contribTerms: undefined,
  investmentManagerPlacementAgent: undefined,
}