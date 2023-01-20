import { IEntity } from "../../lib/api-wrappers/IEntity"
export interface IResetPassword extends IEntity {

  username: string | undefined,

}

export const defaultIResetPassword : IResetPassword = {
  id : undefined,
  parentId: undefined,
  username: undefined,
}
