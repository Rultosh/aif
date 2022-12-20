import { IEntity } from "../../../../lib/api-wrappers/IEntity";

export interface IDetailedApplication2E extends IEntity {
  listOfExternalFirms: string | undefined,
  monitoringPractices: string | undefined,
  imValueAdd: string | undefined,
  investmentRisksAndMitigations: string | undefined,
  reportingStructure: string | undefined,
  freqOfMeeting: string | undefined,
}

export const defaultIDetailedApplication2E : IDetailedApplication2E = {
  id: undefined,
  parentId: undefined,
  listOfExternalFirms: undefined,
  monitoringPractices: undefined,
  imValueAdd: undefined,
  investmentRisksAndMitigations: undefined,
  reportingStructure: undefined,
  freqOfMeeting: undefined,
}