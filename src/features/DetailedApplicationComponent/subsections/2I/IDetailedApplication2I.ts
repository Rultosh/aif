import { IEntity } from "../../../../lib/api-wrappers/IEntity";

export interface IDetailedApplication2I extends IEntity {
  placementMemo: string | undefined,
  investorPresentation: string | undefined,
  contributionAgreement: string | undefined,
  imAgreement: string | undefined,
  trustDeed: string | undefined,
  sebiRegistration: string | undefined,
  sebiCompliance: string | undefined,
  sebiComplianceAvailable: boolean | undefined
}

export const defaultIDetailedApplication2I : IDetailedApplication2I = {
  id: undefined,
  parentId: undefined,
  placementMemo: undefined,
  investorPresentation: undefined,
  contributionAgreement: undefined,
  imAgreement: undefined,
  trustDeed: undefined,
  sebiRegistration: undefined,
  sebiCompliance: undefined,
  sebiComplianceAvailable: false
}