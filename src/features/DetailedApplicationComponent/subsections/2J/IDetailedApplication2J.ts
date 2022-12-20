import { IEntity } from "../../../../lib/api-wrappers/IEntity";

export interface IDetailedApplication2J extends IEntity {
  boradOfDirectorsDefaulters: string | undefined,
  connectedFi: string | undefined,
  boardOfDirectorsWithPoa: string | undefined,
  boardResolution: string | undefined,
}

export const defaultIDetailedApplication2J : IDetailedApplication2J = {
  id: undefined,
  parentId: undefined,
  boradOfDirectorsDefaulters: undefined,
  connectedFi: undefined,
  boardOfDirectorsWithPoa: undefined,
  boardResolution: undefined,
}