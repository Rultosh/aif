import { IEntity } from "../../lib/api-wrappers/IEntity";

export interface IQueryResolution extends IEntity {
  createdBy: string | undefined,
  createdByName: string | undefined,
  createdOn: string | undefined,
  updatedBy: string | undefined,
  updatedOn: string | undefined,
  query: string | undefined,
  
  
}

export const defaultIQueryResolution : IQueryResolution = {
  id: undefined,
  parentId: undefined,
  createdBy: undefined,
  createdByName: undefined,
  createdOn: undefined,
  updatedBy: undefined,
  updatedOn: undefined,
  query: undefined,
}