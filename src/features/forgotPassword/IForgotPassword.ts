import { IEntity } from "../../lib/api-wrappers/IEntity"

type Password = {
    ciphertext: String | undefined,
    salt: String | undefined,
    iv: String | undefined,
}

export interface IForgotPassword extends IEntity {

  token: string | undefined,
  password: string | undefined,
  passwordWithSaltAndIv: Password | undefined,
  matchingPassword: string | undefined
}

export const defaultIForgotPassword : IForgotPassword = {
  id : undefined,
  parentId: undefined,
  token: undefined,
  password: undefined,
  passwordWithSaltAndIv: undefined,
  matchingPassword: undefined
}
