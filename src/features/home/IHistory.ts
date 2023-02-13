import { IEntity } from "../../lib/api-wrappers/IEntity";

export interface IHistory extends IEntity {
  status: string | undefined,
  stage: string | undefined,
  createdOn: string | undefined,
  remarks: string | undefined,
  history: string | undefined,
}

export const defaultIHistory : IHistory = {
  id: undefined,
  parentId: undefined,
  status: undefined,
  stage: undefined,
  createdOn: undefined,
  remarks: undefined,
  history: undefined,
}