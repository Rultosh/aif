import api from "../../app/api";
import { IForgotPassword } from "./IForgotPassword";
import {  IResetPassword } from "../resetPassword/IResetPassword"
import {IChangePassword} from '../changePassword/IChangePassword'
import encrypt from "../../components/auth/encrypt";



export function setPassword(passwordDetails:IForgotPassword) {
  passwordDetails.password = encrypt(passwordDetails.password);
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
  passwordDetails.oldPassword = encrypt(passwordDetails.oldPassword);
  passwordDetails.password = encrypt(passwordDetails.password);
  passwordDetails.matchingPassword = encrypt(passwordDetails.matchingPassword);
  return api({
    method: 'post',
    data: passwordDetails,
    url: `auth/changepassword`
  });
}



