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

export function patchUserOtpRequired(userId: number, otpRequired: boolean) {
  return api({
    method: 'patch',
    url: `useradmin/users/${userId}/otp-required`,
    data: { otpRequired },
  });
}

export function deleteUser(userId: number) {
  return api({
    method: 'delete',
    url: `useradmin/users/${userId}`,
  });
}

export function assignManagerRole(userId: number) {
  return api({
    method: 'post',
    url: `useradmin/users/${userId}/assign-manager`,
  });
}

export function createOperationalUser(payload: {
  username: string;
  contactPerson: string;
  companyName: string;
  title: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  sebiRegistration?: string;
  role: string;
}) {
  return api({
    method: 'post',
    url: `useradmin/users/operational`,
    data: payload,
  });
}

export function patchUserRoles(userId: number, role: string) {
  return api({
    method: 'patch',
    url: `useradmin/users/${userId}/roles`,
    data: { role },
  });
}

