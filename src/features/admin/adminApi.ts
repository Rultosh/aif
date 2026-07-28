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

export function updateUserProfile(payload: { username?: string; phoneNumber?: string; contactPerson?: string }) {
  return api({
    method: 'patch',
    url: `api/users/me`,
    data: payload,
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

export function assignUserAdminRole(userId: number) {
  return api({
    method: 'post',
    url: `useradmin/users/${userId}/assign-useradmin`,
  });
}

export function sendSetPasswordEmail(userId: number) {
  return api({
    method: 'post',
    url: `useradmin/users/${userId}/send-set-password`,
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

export function getUserApplicationCount(userId: number) {
  return api({
    method: 'get',
    url: `useradmin/users/${userId}/application-count`,
  });
}

export function patchUserRoles(userId: number, role: string) {
  return api({
    method: 'patch',
    url: `useradmin/users/${userId}/roles`,
    data: { role },
  });
}

export function fetchRegistrationConfig() {
  return api({
    method: 'get',
    url: `useradmin/config/registration`,
  });
}

export function updateRegistrationConfig(payload: {
  registrationEnabled: boolean;
  closedMessage?: string;
}) {
  return api({
    method: 'patch',
    url: `useradmin/config/registration`,
    data: payload,
  });
}

export function fetchIaPassThresholdsConfig() {
  return api({
    method: 'get',
    url: `useradmin/config/ia-pass-thresholds`,
  });
}

export function updateIaPassThresholdsConfig(payload: {
  firstTimeEquity: number;
  firstTimeDebt: number;
  experiencedEquity: number;
  experiencedDebt: number;
}) {
  return api({
    method: 'patch',
    url: `useradmin/config/ia-pass-thresholds`,
    data: payload,
  });
}

export type NdaConfigResponse = {
  fileName?: string | null;
  bucket: string;
  available: boolean;
};

export function fetchNdaConfig() {
  return api({
    method: 'get',
    url: `useradmin/config/nda`,
  });
}

export function updateNdaConfig(payload: { fileName: string }) {
  return api({
    method: 'patch',
    url: `useradmin/config/nda`,
    data: payload,
  });
}

export function clearNdaConfig() {
  return api({
    method: 'delete',
    url: `useradmin/config/nda`,
  });
}

/** Authenticated applicants / staff — active NDA metadata. */
export function fetchActiveNdaConfig() {
  return api({
    method: 'get',
    url: `api/config/nda`,
  });
}

/** Public (no auth) — used on login / signup pages. */
export async function fetchPublicRegistrationStatus() {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const axios = (await import('axios')).default;
  return axios.get(`${baseURL}/auth/registration-status`);
}

/** Public — SelfRating pass thresholds (manager type × fund type). */
export async function fetchPublicIaPassThresholds() {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const axios = (await import('axios')).default;
  return axios.get(`${baseURL}/auth/ia-pass-thresholds`);
}

