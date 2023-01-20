import { IEntity } from "../../lib/api-wrappers/IEntity"
export interface IChangePassword extends IEntity {

    oldPassword: string | undefined,
    password: string | undefined,
    matchingPassword: string | undefined,
  }
  
  export const defaultIChangePassword : IChangePassword = {
    id : undefined,
    parentId: undefined,
    oldPassword: undefined,
    password: undefined,
    matchingPassword: undefined
  }