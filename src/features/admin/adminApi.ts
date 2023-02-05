import api from "../../app/api";
import { IUser } from "./IUser";

export function fetchUsers() {
  return api({
    method: 'get',
    url: `useradmin/users`
  });
}

export function approveUser(userDetails:IUser) {
  return api({
    method: 'post',
    data: {username:userDetails.username, role:userDetails.role},
    url: `useradmin/users/${userDetails.id}/approve`
  });
}

export function whoAmI() {
  return api({
    method: 'get',
    url: `api/users/me`
  });
}

