import api from "../../app/api";
import { ISignup } from "./ISignup";



export function signupUser(userDetails:ISignup) {
  return api({
    method: 'post',
    data: userDetails,
    url: `auth/signup`
  });
}

