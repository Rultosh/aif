import { IEntity } from "../../lib/api-wrappers/IEntity"

type Password = {
    ciphertext: String | undefined,
    salt: String | undefined,
    iv: String | undefined,
}

export interface IChangePassword extends IEntity {

    oldPassword: string | undefined,
    oldPasswordWithSaltAndIv: Password | undefined,
    password: string | undefined,
    passwordWithSaltAndIv: Password | undefined,
    matchingPassword: string | undefined,
  }
  
  export const defaultIChangePassword : IChangePassword = {
    id : undefined,
    parentId: undefined,
    oldPassword: undefined,
    oldPasswordWithSaltAndIv: undefined,
    password: undefined,
    passwordWithSaltAndIv: undefined,
    matchingPassword: undefined,
  }