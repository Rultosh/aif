import api from "../../app/api";
import { ILoginRequest } from "./authenticationSlice";

export function authenticate(loginRequest: ILoginRequest) {
    return api({
        method: 'post',
        data: loginRequest,
        url: `/auth/authenticate`
    });    
}
