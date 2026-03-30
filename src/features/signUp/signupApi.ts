import api from "../../app/api";
import { encryptData } from "../../components/auth/encryption";
import { ISignup } from "./ISignup";

export function signupUser(userDetails: ISignup) {
  const { password, confirmPassword, ...rest } = userDetails;
  return api({
    method: 'post',
    data: {
      ...rest,
      passwordWithSaltAndIv: encryptData(password ?? ''),
      confirmPasswordWithSaltAndIv: encryptData(confirmPassword ?? ''),
    },
    url: `auth/signup`
  });
}

