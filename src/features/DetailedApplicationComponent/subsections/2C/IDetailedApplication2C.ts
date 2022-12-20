import { IEntity } from "../../../../lib/api-wrappers/IEntity";

export interface IDetailedApplication2C extends IEntity {
  approvers: string | undefined,
  nominatinPolicy: string | undefined,
  detailedProfile: string | undefined,
  advisoryBoardProfile: string | undefined,
  investmentStrategy: string | undefined,
  grossReturnObjective: string | undefined,
  targetSizePercentage: string | undefined,
  targetNumberOfInvestmentPlanned: string | undefined,
  avgHoldingPeriod: string | undefined,
  exitStrategy: string | undefined,
  controlsAndRights: string | undefined,
  managementReplacements: string | undefined,
  investmentRollover: string | undefined,
}

export const defaultIDetailedApplication2C : IDetailedApplication2C = {
  id: undefined,
  parentId: undefined,
  approvers: undefined,
  nominatinPolicy: undefined,
  detailedProfile: undefined,
  advisoryBoardProfile: undefined,
  investmentStrategy: undefined,
  grossReturnObjective: undefined,
  targetSizePercentage: undefined,
  targetNumberOfInvestmentPlanned: undefined,
  avgHoldingPeriod: undefined,
  exitStrategy: undefined,
  controlsAndRights: undefined,
  managementReplacements: undefined,
  investmentRollover: undefined,
}