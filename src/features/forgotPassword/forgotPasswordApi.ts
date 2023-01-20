import api from "../../app/api";
import { IForgotPassword } from "./IForgotPassword";
import {  IResetPassword } from "../resetPassword/IResetPassword"
import {IChangePassword} from '../changePassword/IChangePassword'



export function setPassword(passwordDetails:IForgotPassword) {
  return api({
    method: 'post',
    data: passwordDetails,
    url: `auth/setpassword`
  });
}

export function resetForgotPassword(email:IResetPassword) {
  return api({
    method: 'post',
    data: email,
    url: `auth/forgotpassword`
  });
}

export function changePassword(passwordDetails:IChangePassword) {
  return api({
    method: 'post',
    data: passwordDetails,
    url: `auth/setpassword`
  });
}



