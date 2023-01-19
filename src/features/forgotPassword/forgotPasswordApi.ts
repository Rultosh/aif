import api from "../../app/api";
import { IForgotPassword } from "./IForgotPassword";



export function setPassword(passwordDetails:IForgotPassword) {
  return api({
    method: 'post',
    data: passwordDetails,
    url: `auth/setpassword`
  });
}

