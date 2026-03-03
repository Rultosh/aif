import api from "../../app/api";
import { IForgotPassword } from "./IForgotPassword";
import {  IResetPassword } from "../resetPassword/IResetPassword"
import {IChangePassword} from '../changePassword/IChangePassword'
import { encryptData } from "../../components/auth/encryption";



export function setPassword(passwordDetails:IForgotPassword) {
  passwordDetails.passwordWithSaltAndIv = encryptData(passwordDetails.password);
  passwordDetails.password = undefined
  passwordDetails.matchingPassword = undefined
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
  // passwordDetails.oldPasswordWithSaltAndIv = encryptData(passwordDetails.oldPassword);
  // passwordDetails.oldPassword = undefined;
  passwordDetails.passwordWithSaltAndIv = encryptData(passwordDetails.password);
  passwordDetails.password = undefined;
  passwordDetails.matchingPassword = undefined;
  return api({
    method: 'post',
    data: passwordDetails,
    url: `auth/changepassword`
  });
}



