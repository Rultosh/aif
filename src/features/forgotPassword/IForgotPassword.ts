import { IEntity } from "../../lib/api-wrappers/IEntity"

export interface IForgotPassword extends IEntity {

  token: string | undefined,
  password: string | undefined,
  matchingPassword: string | undefined,
}

export const defaultIForgotPassword : IForgotPassword = {
  id : undefined,
  parentId: undefined,
  token: undefined,
  password: undefined,
  matchingPassword: undefined
}
