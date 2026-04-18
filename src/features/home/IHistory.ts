import { IEntity } from "../../lib/api-wrappers/IEntity";

export interface IHistory extends IEntity {
  status: string | undefined,
  stage: string | undefined,
  createdOn: string | undefined,
  /** User id who recorded this status row (when provided by API). */
  createdBy?: number | undefined,
  createdByName: string | undefined,
  remarks: string | undefined,
  attachmentBucket?: string | undefined,
  attachmentName?: string | undefined,
  applicantVisible?: boolean | undefined,
  history: string | undefined,
}

export const defaultIHistory : IHistory = {
  id: undefined,
  parentId: undefined,
  status: undefined,
  stage: undefined,
  createdOn: undefined,
  createdBy: undefined,
  createdByName: undefined,
  remarks: undefined,
  attachmentBucket: undefined,
  attachmentName: undefined,
  applicantVisible: undefined,
  history: undefined,
}