import api from "../../app/api";
import { ILoginRequest } from "./authenticationSlice";
import encrypt from "./encrypt";

export function authenticate(loginRequest: ILoginRequest) {

    loginRequest.password = encrypt(loginRequest.password);

    return api({
        method: 'post',
        data: loginRequest,
        url: `/auth/authenticate`
    });    
}
