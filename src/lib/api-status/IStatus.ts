export enum FetchStatus {
    DOING = 'doing',
    IDLE = 'idle',
    FAILED = 'failed'
}

export enum ResponseCode {
    NOT_FOUND = 404,
    FORBIDDEN = 403,
    SUCCESS = 200,
    CONFLICT = 409,
}

export interface IStatus {
    fetchStatus?: FetchStatus,
    responseCode?: ResponseCode,
    message?: string
}

export const defalutResStatus = {fetchStatus: FetchStatus.IDLE, responseCode: ResponseCode.SUCCESS, message: ""};