import { AxiosError } from "axios";
import { FetchStatus, IStatus, ResponseCode } from "./IStatus";

export interface Error {
  [key: string]: string;
}

export function getError(error: any) : IStatus {
  let response = (error as AxiosError).response;
  console.log("Get Error: " + JSON.stringify({
    fetchStatus: FetchStatus.FAILED, 
    responseCode: response?.status.toString(), 
    message: response?.data ? (response?.data as Error).error : error.message
  } as IStatus));
  return ({
    fetchStatus: FetchStatus.FAILED, 
    responseCode: response?.status as ResponseCode, 
    message: response?.data ? (response?.data as Error).error : error.message
  });
}
