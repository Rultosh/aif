import api from "../../app/api";
import { ILoginRequest } from "./authenticationSlice";
import { encryptData } from "./encryption";

export function authenticate(loginRequest: ILoginRequest) {

    let passwordWithSaltAndIv = encryptData(loginRequest.password);

    loginRequest = {...loginRequest, passwordWithSaltAndIv, password: undefined};

    return api({
        method: 'post',
        data: loginRequest,
        url: `/auth/authenticate`
    });    
}

export function verifyMfa(params: { challengeId: string; otp: string }) {
    return api({
        method: 'post',
        data: params,
        url: `/auth/mfa/verify`,
    });
}
